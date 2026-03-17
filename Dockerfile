FROM python:3.10-slim

WORKDIR /app

# 2. Copy ONLY requirements first
COPY requirements.txt .

# 3. Install libraries (This layer will now stay cached!)
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy the heavy model file separately 
COPY vehicle_model.pth .

# 5. Finally, copy your frequently changing code
COPY server.py .
COPY public/ ./public/

CMD [ "python", "server.py" ]