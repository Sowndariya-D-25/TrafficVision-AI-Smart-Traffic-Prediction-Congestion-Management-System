from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.jwt_handler import verify_access_token
from app.database.mongodb import users_collection

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    print("================================")
    print("Received Token:", credentials.credentials)

    token = credentials.credentials

    payload = verify_access_token(token)

    print("Decoded Payload:", payload)
    print("================================")

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user = await users_collection.find_one(
        {"email": payload["sub"]}
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user