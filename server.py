from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
from torch.nn import functional as F
from torchvision import transforms
from PIL import Image
import io

app = FastAPI()

# Allow your HTML file to talk to this API
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)

# --- Load your Model Architecture (Same as your training code) ---
class VehicleCNN(nn.Module):
  def __init__(self):
    super(VehicleCNN, self).__init__()
    # First layer: 3 input channels (RGB), 16 filters
    self.conv1 = nn.Conv2d(3, 16, kernel_size=3, padding=1)
    self.pool = nn.MaxPool2d(2, 2) # Reduces size by half
    
    # Second layer: 16 input channels, 32 filters
    self.conv2 = nn.Conv2d(16, 32, kernel_size=3, padding=1)
    
    # Fully connected layers (The 'Classifier')
    # We must calculate the input size based on the image dimensions
    self.fc1 = nn.Linear(32 * 56 * 56, 128) 
    self.fc2 = nn.Linear(128, 7) # Final output: 7 classes

  def forward(self, x):
    # Sequence: Conv -> ReLU -> Pool
    x = self.pool(F.relu(self.conv1(x)))
    x = self.pool(F.relu(self.conv2(x)))
    
    # Flatten the data for the Linear layers
    x = x.view(-1, 32 * 56 * 56)
    x = F.relu(self.fc1(x))
    x = self.fc2(x)
    return x
  
# Initialize and load weights
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = VehicleCNN().to(device)
model.load_state_dict(torch.load("vehicle_model.pth", map_location=device))
model.eval()

# Define labels (Ensure this matches your dataset.classes order!)
CLASSES = ['bikes', 'cars', 'motorcycles', 'planes', 'rickshaws', 'ships', 'trains']

# Image Preprocessing
transform = transforms.Compose([
  transforms.Resize((224, 224)),
  transforms.ToTensor(),
  transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
  # 1. Read image
  contents = await file.read()
  image = Image.open(io.BytesIO(contents)).convert('RGB')
  
  # 2. Transform
  img_tensor = transform(image).unsqueeze(0).to(device)
  
  # 3. Predict
  with torch.no_grad():
    outputs = model(img_tensor)
    _, predicted_idx = torch.max(outputs, 1)
    print(predicted_idx)
  class_name = CLASSES[predicted_idx.item()-1]
  
  return {"prediction": class_name}

if __name__ == "__main__":
  import uvicorn
  uvicorn.run(app, host="0.0.0.0", port=8000)