# 🏎️ Vehicle Type Classification System

A full-stack Deep Learning application that classifies vehicle images into 7 distinct categories using a Convolutional Neural Network (CNN). The project features a high-performance REST API for real-time inference and a clean web interface for user interaction.

## 🌟 Key Features

* Custom CNN Architecture: Optimized for feature extraction (wheels, grilles, headlights).

* FastAPI Backend: Asynchronous image processing and model serving.

* Real-time Inference: Predicts vehicle types in milliseconds.

* Responsive UI: Simple HTML/JS interface with live image previews.

## 📂 Project Structure

```plaintext
├── data/               # Training dataset (7 subfolders)
├── models/             
│   └── vehicle_model.pth # Saved model weights
├── notebooks/          
│   └── training.ipynb   # Jupyter notebook for model development
├── static/             
│   └── index.html       # Web frontend
├── main.py             # FastAPI backend server
├── requirements.txt    # Project dependencies
└── README.md
```

## 🧠 Model Architecture

* The model is a custom CNN built with PyTorch:

* **Layer 1:** Conv2d (3 to 16 channels) + ReLU + MaxPool.

* **Layer 2:** Conv2d (16 to 32 channels) + ReLU + MaxPool.

* **Classifier:** Flattened layer followed by a 128-node Dense layer and a 7-node output layer representing:

* Car, Truck, Motorcycle, bikes, train and Other.

## 🚀 Installation & Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/vehicle-classification.git
    cd vehicle-classification
    ```

2. **Install Dependencies**

    ```bash
    pip install -r requirements.txt
    ```

3. **Run the API Backend**

    ```bash
    python server.py
    ```

  The server will start at `http://localhost:8000`.

## 🖥️ Usage

* Open static/index.html in your browser.

* Upload an image of a vehicle (JPG/PNG).

* The system will send the image to the FastAPI backend, process it through the PyTorch model, and display the result instantly.

## 📊 Technical Implementation

* DetailsPreprocessing: Images are resized to 224x224 and normalized using ImageNet mean/std.

* Optimizer: Adam ($LR=0.001$).

* Loss Function: Cross-Entropy Loss.

* Inference: model.eval() mode with torch.no_grad() to ensure speed and efficiency.
