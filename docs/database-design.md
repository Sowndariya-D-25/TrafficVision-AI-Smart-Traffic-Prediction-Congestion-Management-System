# TrafficVision AI – Database Design

## Users

- id (Primary Key)
- name
- email
- password
- role
- created_at

## Traffic Data

- id (Primary Key)
- location
- vehicle_count
- average_speed
- congestion_level
- timestamp

## Predictions

- id (Primary Key)
- traffic_id (Foreign Key)
- predicted_congestion
- confidence
- predicted_time

## Alerts

- id (Primary Key)
- traffic_id (Foreign Key)
- alert_type
- message
- severity
- created_at

## Routes

- id (Primary Key)
- source
- destination
- estimated_time
- alternate_route