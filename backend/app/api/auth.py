from fastapi import APIRouter, HTTPException
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.schemas.user import UserRegister
from app.schemas.login import UserLogin
from app.core.security import hash_password, verify_password
from app.core.jwt_handler import create_access_token
from app.database.mongodb import users_collection
from app.core.jwt_handler import verify_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

security = HTTPBearer()

@router.get("/")
async def auth_home():
    return {
        "message": "Authentication Module Working"
    }

@router.post("/register")
async def register(user: UserRegister):

    # Check if the email already exists
    existing_user = await users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = hash_password(user.password)

    # Create the user document
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role
    }

    # Save to MongoDB
    result = await users_collection.insert_one(new_user)

    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }

@router.post("/login")
async def login(user: UserLogin):

    # Find user by email
    existing_user = await users_collection.find_one(
        {"email": user.email}
    )

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Generate JWT Token
    access_token = create_access_token(
        {
            "sub": existing_user["email"],
            "role": existing_user["role"]
        }
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/profile")
async def profile(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    return {
        "message": "Profile fetched successfully",
        "user": {
            "email": payload["sub"],
            "role": payload["role"]
        }
    }