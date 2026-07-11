from pydantic import BaseModel, Field
from datetime import datetime


class TrafficData(BaseModel):
    location: str
    vehicle_count: int
    average_speed: float
    road_status: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)