from fastapi import APIRouter, Depends, Query
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
async def get_all_traffic(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=500),
    search: str = "",
    congestion: str = ""
):

    skip = (page - 1) * limit

    query = {}

    if search:
        query["location"] = {
            "$regex": search,
            "$options": "i"
        }

    if congestion:
        query["congestion_level"] = congestion

    traffic_list = []

    cursor = (
        traffic_collection
        .find(query)
        .skip(skip)
        .limit(limit)
    )

    async for traffic in cursor:
        traffic["_id"] = str(traffic["_id"])
        traffic_list.append(traffic)

    total_records = await traffic_collection.count_documents(query)

    return {
        "page": page,
        "limit": limit,
        "total_records": total_records,
        "data": traffic_list
    }