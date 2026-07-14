import asyncio
import os
import sys
from datetime import datetime

import pandas as pd

# Allow importing from app/
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database.mongodb import traffic_collection
from app.utils.congestion import calculate_congestion


def calculate_speed(vehicle_count):
    if vehicle_count > 100:
        return 25

    elif vehicle_count >= 50:
        return 45

    return 65


def calculate_road_status(congestion):
    if congestion == "High":
        return "Busy"

    elif congestion == "Medium":
        return "Moderate"

    return "Clear"


async def import_dataset():

    file_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "datasets",
        "traffic_dataset.csv",
    )

    df = pd.read_csv(file_path)

    print(f"Loaded {len(df)} records.")

    await traffic_collection.delete_many({})

    records = []

    for _, row in df.iterrows():

        vehicle_count = int(row["Vehicles"])

        average_speed = calculate_speed(vehicle_count)

        congestion = calculate_congestion(
            vehicle_count,
            average_speed,
        )

        record = {
            "location": f"Junction {row['Junction']}",
            "vehicle_count": vehicle_count,
            "average_speed": average_speed,
            "road_status": calculate_road_status(congestion),
            "congestion_level": congestion,
            "timestamp": datetime.strptime(
                row["DateTime"],
                "%Y-%m-%d %H:%M:%S",
            ),
        }

        records.append(record)

    if records:
        await traffic_collection.insert_many(records)

    print(f"Successfully imported {len(records)} records.")


if __name__ == "__main__":
    asyncio.run(import_dataset())