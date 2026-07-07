from fastapi import FastAPI

app = FastAPI(
    title="TrafficVision AI API",
    description="Backend API for Smart Traffic Prediction and Congestion Management",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Welcome to TrafficVision AI API"
    }