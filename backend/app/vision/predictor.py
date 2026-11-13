"""
Cosmo AI Backend — Redshift Predictor Service
=============================================
Inference pipeline for estimating galaxy spectroscopic redshift (z)
from 5-band astronomical image cutouts (g, r, i, z, y at 127x127) using
a trained ResNet-18 model.

Dataset: GalaxiesML (Hyper Suprime-Cam Subaru Strategic Program PDR2)
Architecture: ResNet-18 (5-channel input, scalar redshift output)
"""

import io
import os
import math
import logging
from pathlib import Path
from typing import Optional, Tuple, Dict, Any, Union

import numpy as np
import torch
import torch.nn as nn

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Pure PyTorch ResNet-18 Implementation (Fallback for torchvision)
# ---------------------------------------------------------------------------
class BasicBlock(nn.Module):
    expansion = 1

    def __init__(self, inplanes: int, planes: int, stride: int = 1, downsample: Optional[nn.Module] = None):
        super().__init__()
        self.conv1 = nn.Conv2d(inplanes, planes, kernel_size=3, stride=stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(planes)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv2d(planes, planes, kernel_size=3, stride=1, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(planes)
        self.downsample = downsample
        self.stride = stride

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        identity = x

        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu(out)

        out = self.conv2(out)
        out = self.bn2(out)

        if self.downsample is not None:
            identity = self.downsample(x)

        out += identity
        out = self.relu(out)
        return out


class PureResNet18(nn.Module):
    """
    Exact architectural replica of torchvision.models.resnet18 with matching
    layer names so that weights load seamlessly without torchvision dependency.
    """
    def __init__(self, in_channels: int = 5, num_outputs: int = 1):
        super().__init__()
        self.inplanes = 64
        self.conv1 = nn.Conv2d(in_channels, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.bn1 = nn.BatchNorm2d(64)
        self.relu = nn.ReLU(inplace=True)
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)

        self.layer1 = self._make_layer(BasicBlock, 64, 2, stride=1)
        self.layer2 = self._make_layer(BasicBlock, 128, 2, stride=2)
        self.layer3 = self._make_layer(BasicBlock, 256, 2, stride=2)
        self.layer4 = self._make_layer(BasicBlock, 512, 2, stride=2)

        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(512 * BasicBlock.expansion, num_outputs)

    def _make_layer(self, block: type, planes: int, blocks: int, stride: int = 1) -> nn.Sequential:
        downsample = None
        if stride != 1 or self.inplanes != planes * block.expansion:
            downsample = nn.Sequential(
                nn.Conv2d(self.inplanes, planes * block.expansion, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(planes * block.expansion),
            )

        layers = []
        layers.append(block(self.inplanes, planes, stride, downsample))
        self.inplanes = planes * block.expansion
        for _ in range(1, blocks):
            layers.append(block(self.inplanes, planes))

        return nn.Sequential(*layers)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.maxpool(x)

        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)

        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.fc(x)
        return x


def build_galaxy_resnet18() -> nn.Module:
    """Builds the 5-channel ResNet-18 model for redshift regression."""
    try:
        from torchvision.models import resnet18
        model = resnet18(weights=None)
        model.conv1 = nn.Conv2d(5, 64, kernel_size=7, stride=2, padding=3, bias=False)
        model.fc = nn.Linear(model.fc.in_features, 1)
        logger.info("Instantiated ResNet-18 via torchvision.")
        return model
    except Exception as e:
        logger.info(f"Using pure-PyTorch ResNet-18 implementation ({e}).")
        return PureResNet18(in_channels=5, num_outputs=1)


# ---------------------------------------------------------------------------
# Cosmological Calculations (Flat Lambda-CDM)
# ---------------------------------------------------------------------------
def compute_cosmology(z: float, H0: float = 70.0, Om: float = 0.3, OL: float = 0.7) -> Dict[str, Any]:
    """
    Computes standard cosmological distance and time metrics for a given redshift z.
    Parameters default to standard flat Lambda-CDM cosmology:
    H0 = 70 km/s/Mpc, Omega_m = 0.3, Omega_Lambda = 0.7.
    """
    z = max(0.0, float(z))
    c_kms = 299792.458  # speed of light in km/s
    DH_Mpc = c_kms / H0  # Hubble distance ~ 4282.7 Mpc
    tH_Gyr = 977.8 / H0  # Hubble time ~ 13.97 Gyr

    def E(zi: float) -> float:
        return math.sqrt(Om * (1.0 + zi)**3 + OL)

    # Simpson's / midpoint integration
    N = 1000
    dz = z / N if z > 0 else 1.0
    comoving_integral = 0.0
    lookback_integral = 0.0

    if z > 0:
        for i in range(N):
            zi = (i + 0.5) * dz
            e_val = E(zi)
            comoving_integral += dz / e_val
            lookback_integral += dz / ((1.0 + zi) * e_val)

    comoving_dist_mpc = DH_Mpc * comoving_integral
    lookback_time_gyr = tH_Gyr * lookback_integral
    luminosity_dist_mpc = comoving_dist_mpc * (1.0 + z)
    angular_diameter_dist_mpc = comoving_dist_mpc / (1.0 + z) if (1.0 + z) > 0 else 0.0
    scale_factor = 1.0 / (1.0 + z)
    age_universe_gyr = 13.787  # Total age of universe in Gyr
    age_at_z = max(0.01, age_universe_gyr - lookback_time_gyr)

    # Cosmic epoch classification
    if z < 0.05:
        epoch = "Local Universe (z < 0.05)"
    elif z < 0.5:
        epoch = "Intermediate Universe (0.05 < z < 0.5)"
    elif z < 1.5:
        epoch = "Cosmic Noon Transition (0.5 < z < 1.5)"
    elif z < 3.0:
        epoch = "Peak Cosmic Star Formation (1.5 < z < 3.0)"
    elif z < 6.0:
        epoch = "Early Epoch & Quasar Era (3.0 < z < 6.0)"
    else:
        epoch = "Cosmic Dawn & Reionization (z > 6.0)"

    return {
        "lookback_time_gyr": round(lookback_time_gyr, 3),
        "comoving_distance_mpc": round(comoving_dist_mpc, 2),
        "comoving_distance_gly": round(comoving_dist_mpc * 3.26156e-3, 3),
        "luminosity_distance_mpc": round(luminosity_dist_mpc, 2),
        "angular_diameter_distance_mpc": round(angular_diameter_dist_mpc, 2),
        "age_at_redshift_gyr": round(age_at_z, 3),
        "scale_factor": round(scale_factor, 4),
        "cosmic_epoch": epoch,
    }


# ---------------------------------------------------------------------------
# Redshift Predictor Service Class
# ---------------------------------------------------------------------------
class RedshiftPredictor:
    """
    Manages the trained ResNet-18 model weights, inference execution, and
    input normalization for HSC 5-band cutouts.
    """

    def __init__(self, model_path: Optional[str] = None):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = build_galaxy_resnet18().to(self.device)
        self.model_path = self._locate_weights(model_path)
        self.is_loaded = False

        if self.model_path and os.path.exists(self.model_path):
            try:
                state_dict = torch.load(self.model_path, map_location=self.device)
                self.model.load_state_dict(state_dict)
                self.model.eval()
                self.is_loaded = True
                logger.info(f"Redshift Predictor weights loaded from '{self.model_path}' on {self.device}!")
            except Exception as e:
                logger.error(f"Failed to load weights from '{self.model_path}': {e}")
                self.model.eval()
        else:
            logger.warning(f"Model file not found at '{self.model_path}'. Running in evaluation mode.")

    def _locate_weights(self, custom_path: Optional[str]) -> Optional[str]:
        if custom_path and os.path.exists(custom_path):
            return custom_path

        # Candidate paths to search from various execution locations
        candidates = [
            Path("models/resnet18_redshift_model.pth"),
            Path("../models/resnet18_redshift_model.pth"),
            Path("../../models/resnet18_redshift_model.pth"),
            Path(__file__).resolve().parent.parent.parent.parent / "models" / "resnet18_redshift_model.pth",
        ]
        for p in candidates:
            if p.exists():
                return str(p.resolve())
        return "models/resnet18_redshift_model.pth"

    def preprocess_array(self, image_input: Union[np.ndarray, torch.Tensor]) -> torch.Tensor:
        """
        Accepts [127, 127, 5] or [5, 127, 127] float32 arrays/tensors.
        Ensures [1, 5, 127, 127] float32 on target device.
        """
        if isinstance(image_input, np.ndarray):
            arr = image_input.astype(np.float32)
            # Channel transposition if channels are last: (H, W, C) -> (C, H, W)
            if arr.ndim == 3 and arr.shape[-1] == 5:
                arr = arr.transpose(2, 0, 1)
            tensor = torch.from_numpy(arr)
        elif isinstance(image_input, torch.Tensor):
            tensor = image_input.float()
            if tensor.ndim == 3 and tensor.shape[-1] == 5:
                tensor = tensor.permute(2, 0, 1)
        else:
            raise ValueError(f"Unsupported image input type: {type(image_input)}")

        # Ensure spatial size is 127x127
        if tensor.ndim == 3:
            tensor = tensor.unsqueeze(0)  # [1, 5, H, W]

        if tensor.shape[1] != 5:
            # If 1-channel or 3-channel input was supplied, pad or duplicate across 5 bands
            if tensor.shape[1] == 1:
                tensor = tensor.repeat(1, 5, 1, 1)
            elif tensor.shape[1] == 3:
                # Duplicate red/infrared channels to make 5
                tensor = torch.cat([tensor, tensor[:, 1:3, :, :]], dim=1)
            elif tensor.shape[1] > 5:
                tensor = tensor[:, :5, :, :]

        if tensor.shape[2] != 127 or tensor.shape[3] != 127:
            tensor = nn.functional.interpolate(tensor, size=(127, 127), mode="bilinear", align_corners=False)

        return tensor.to(self.device)

    def predict(self, image_input: Union[np.ndarray, torch.Tensor]) -> float:
        """
        Accepts a 5-channel galaxy array (127, 127, 5) or tensor [5, 127, 127].
        Returns: float (Predicted Spectroscopic Redshift z >= 0.0)
        """
        img_tensor = self.preprocess_array(image_input)

        with torch.no_grad():
            pred_z = self.model(img_tensor).item()

        # Physical boundary clamp (redshift cannot be negative)
        return max(0.0, float(pred_z))

    def get_model_info(self) -> Dict[str, Any]:
        """Returns technical specifications of the trained model."""
        return {
            "name": "ResNet-18 Galaxy Redshift Estimator",
            "architecture": "Modified ResNet-18 (5-band input Conv2d -> GlobalAvgPool -> 1-dim scalar Linear)",
            "input_channels": ["g (475 nm)", "r (622 nm)", "i (771 nm)", "z (891 nm)", "y (976 nm)"],
            "resolution": "127 x 127 pixels",
            "weights_loaded": self.is_loaded,
            "weights_path": self.model_path,
            "dataset": "GalaxiesML (Hyper Suprime-Cam Subaru Strategic Program PDR2)",
            "training_samples": 163658,
            "test_samples": 40914,
            "metrics": {
                "rmse": 0.2399,
                "sigma_nmad": 0.0319,
                "outlier_fraction_percent": 4.98,
                "loss_function": "Huber Loss (delta=0.1)",
                "optimizer": "Adam (lr=1e-3)",
            },
            "device": str(self.device),
        }


# ---------------------------------------------------------------------------
# Singleton Provider
# ---------------------------------------------------------------------------
_predictor_instance: Optional[RedshiftPredictor] = None

def get_predictor() -> RedshiftPredictor:
    """Returns the singleton instance of RedshiftPredictor."""
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = RedshiftPredictor()
    return _predictor_instance

