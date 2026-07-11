import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get MongoDB connection string from .env
MONGODB_URL = os.getenv("MONGODB_URL")

# Create MongoDB client
client = AsyncIOMotorClient(MONGODB_URL)

# Connect to the database
db = client["trafficvision_ai"]

# Collections
users_collection = db["users"]
traffic_collection = db["traffic_data"]
predictions_collection = db["predictions"]
alerts_collection = db["alerts"]
routes_collection = db["routes"]