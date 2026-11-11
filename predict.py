import os
import h5py
import numpy as np
import torch
import torch.nn as nn
from torchvision.models import resnet18

def get_model():
    model = resnet18(weights=None)
    model.conv1 = nn.Conv2d(5, 64, kernel_size=7, stride=2, padding=3, bias=False)
    model.fc = nn.Linear(model.fc.in_features, 1)
    return model

class RedshiftPredictor:
    def __init__(self, model_path="models/resnet18_redshift_model.pth"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = get_model().to(self.device)
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at '{model_path}'. Make sure it's in the models/ directory.")
            
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.eval()
        print(f"Redshift Predictor initialized successfully on {self.device}!")

    def predict(self, image_input):
        """
        Accepts a 5-channel galaxy array (127, 127, 5) or tensor [5, 127, 127].
        Returns: float (Predicted Spectroscopic Redshift z)
        """
        if isinstance(image_input, np.ndarray):
            if image_input.shape[-1] == 5:
                image_input = image_input.transpose(2, 0, 1)
            img_tensor = torch.tensor(image_input, dtype=torch.float32)
        else:
            img_tensor = image_input

        if img_tensor.ndim == 3:
            img_tensor = img_tensor.unsqueeze(0)

        img_tensor = img_tensor.to(self.device)
        
        with torch.no_grad():
            pred_z = self.model(img_tensor).item()
            
        return pred_z

if __name__ == "__main__":
    predictor = RedshiftPredictor()
    dummy_input = np.random.randn(127, 127, 5).astype(np.float32)
    print(f"Test Run Prediction: z = {predictor.predict(dummy_input):.4f}")