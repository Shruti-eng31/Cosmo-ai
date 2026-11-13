"""
Cosmo AI Backend — Pydantic Schemas for Vision & Redshift Estimation
====================================================================
Defines request and response models for galaxy image analysis and
spectroscopic redshift prediction using the ResNet-18 model.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class CosmologyParameters(BaseModel):
    """Cosmological parameters calculated under Lambda-CDM cosmology."""
    lookback_time_gyr: float = Field(..., description="Lookback time in billions of years.")
    comoving_distance_mpc: float = Field(..., description="Comoving radial distance in Megaparsecs.")
    comoving_distance_gly: float = Field(..., description="Comoving distance in Giga light-years.")
    luminosity_distance_mpc: float = Field(..., description="Luminosity distance in Megaparsecs.")
    angular_diameter_distance_mpc: float = Field(..., description="Angular diameter distance in Megaparsecs.")
    age_at_redshift_gyr: float = Field(..., description="Age of the universe at the observed redshift epoch.")
    scale_factor: float = Field(..., description="Cosmological scale factor a = 1 / (1 + z).")
    cosmic_epoch: str = Field(..., description="Cosmological epoch description.")


class BandStat(BaseModel):
    """Mean and standard deviation for an individual photometric band."""
    band: str
    wavelength_nm: int
    mean_flux: float
    max_flux: float


class RedshiftPrediction(BaseModel):
    """Response payload for redshift prediction endpoints."""
    predicted_z: float = Field(..., description="Predicted spectroscopic redshift (z).")
    confidence_interval: List[float] = Field(..., description="Estimated [lower, upper] 68% credible interval.")
    cosmology: CosmologyParameters = Field(..., description="Cosmological context under Lambda-CDM.")
    model_info: Dict[str, Any] = Field(..., description="Model and execution metadata.")
    object_name: Optional[str] = Field(default="Uploaded Galaxy Cutout", description="Target object identifier.")
    band_statistics: Optional[List[BandStat]] = Field(default=None, description="Per-band photometric flux statistics.")


class SamplePredictionRequest(BaseModel):
    """Request payload for evaluating pre-configured survey galaxy samples."""
    sample_id: str = Field(
        ...,
        description="Identifier of pre-configured sample (e.g., 'hsc-starburst', 'hsc-lrg', 'hsc-highz').",
        examples=["hsc-starburst"],
    )


class ModelMetrics(BaseModel):
    rmse: float
    sigma_nmad: float
    outlier_fraction_percent: float
    loss_function: str
    optimizer: str


class ModelInfoResponse(BaseModel):
    """Response payload for model metadata and training specifications."""
    name: str
    architecture: str
    input_channels: List[str]
    resolution: str
    weights_loaded: bool
    weights_path: Optional[str] = None
    dataset: str
    training_samples: int
    test_samples: int
    metrics: ModelMetrics
    device: str

