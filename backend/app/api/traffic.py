from fastapi import APIRouter, Depends
from app.schemas.traffic import TrafficData
from app.database.mongodb import traffic_collection
from app.dependencies.role_checker import admin_required
from app.utils.congestion import calculate_congestion

router = APIRouter(
    prefix="/traffic",
    tags=["Traffic"]
)


@router.post("/")
async def add_traffic_data(
    data: TrafficData,
    current_user=Depends(admin_required)
):
    # Convert Pydantic model to dictionary
    traffic = data.model_dump()

    # Automatically calculate congestion level
    traffic["congestion_level"] = calculate_congestion(
        traffic["vehicle_count"],
        traffic["average_speed"]
    )

    # Save to MongoDB
    result = await traffic_collection.insert_one(traffic)

    return {
        "message": "Traffic data added successfully",
        "id": str(result.inserted_id),
        "congestion_level": traffic["congestion_level"]
    }


@router.get("/")
async def get_all_traffic():

    traffic_list = []

    async for traffic in traffic_collection.find():

        traffic["_id"] = str(traffic["_id"])

        traffic_list.append(traffic)

    return traffic_list