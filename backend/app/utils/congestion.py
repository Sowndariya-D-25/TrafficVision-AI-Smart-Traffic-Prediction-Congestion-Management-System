def calculate_congestion(vehicle_count, average_speed):
    if vehicle_count > 100 or average_speed < 30:
        return "High"

    elif 50 <= vehicle_count <= 100 or 30 <= average_speed <= 50:
        return "Medium"

    else:
        return "Low"