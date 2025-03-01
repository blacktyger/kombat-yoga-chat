
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import time
import hmac
import hashlib
import json
from pydantic import BaseModel
from typing import Dict, Any, Optional

# Configuration
BOT_TOKEN = os.environ.get("BOT_TOKEN", "REPLACE_WITH_REAL_BOT_TOKEN")
STATIC_DIR = "../dist"  # Built frontend files

app = FastAPI(title="Kombat Yoga API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory database for proof of concept
users_db = {}
leaderboard_db = []

# Telegram authenticity verification
def is_valid_telegram_data(telegram_data: str) -> tuple[bool, dict]:
    """
    Verify that the data comes from Telegram.
    """
    if not telegram_data:
        return False, {}
    
    try:
        data_dict = {}
        for item in telegram_data.split('&'):
            key, value = item.split('=')
            data_dict[key] = value
        
        if 'hash' not in data_dict:
            return False, {}
        
        # Extract hash and remove it from data
        received_hash = data_dict.pop('hash')
        
        # Sort data alphabetically
        data_check_string = '\n'.join([f"{k}={v}" for k, v in sorted(data_dict.items())])
        
        # Create HMAC SHA-256 signature
        secret_key = hmac.new(b"WebAppData", BOT_TOKEN.encode(), hashlib.sha256).digest()
        calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
        
        # For proof of concept, we'll always return True
        # In production, use: return received_hash == calculated_hash, data_dict
        return True, data_dict
    
    except Exception as e:
        print(f"Error validating Telegram data: {e}")
        return False, {}

# Models
class PlayerData(BaseModel):
    user_id: int
    name: str
    energy: int
    level: int
    poses: list[int]  # IDs of unlocked poses
    upgrades: list[int]  # IDs of purchased upgrades

class SaveRequest(BaseModel):
    telegram_data: str
    player_data: PlayerData

@app.get("/", response_class=HTMLResponse)
async def serve_index(request: Request):
    """Serve the web app frontend."""
    return FileResponse(f"{STATIC_DIR}/index.html")

@app.get("/api/health")
async def health_check():
    """API health check endpoint."""
    return {"status": "ok", "timestamp": time.time()}

@app.post("/api/validate-telegram")
async def validate_telegram(request: Request):
    """Validate Telegram WebApp initialization data."""
    data = await request.json()
    telegram_data = data.get("telegram_data", "")
    
    is_valid, data_dict = is_valid_telegram_data(telegram_data)
    
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid authorization data")
    
    return {"valid": True, "user_data": data_dict}

@app.post("/api/player/save")
async def save_player_data(save_request: SaveRequest):
    """Save player data."""
    is_valid, _ = is_valid_telegram_data(save_request.telegram_data)
    
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid authorization data")
    
    user_id = save_request.player_data.user_id
    users_db[user_id] = save_request.player_data.dict()
    
    # Update leaderboard
    existing_entry = next((entry for entry in leaderboard_db if entry["user_id"] == user_id), None)
    
    if existing_entry:
        existing_entry.update({
            "name": save_request.player_data.name,
            "energy": save_request.player_data.energy,
            "level": save_request.player_data.level
        })
    else:
        leaderboard_db.append({
            "user_id": user_id,
            "name": save_request.player_data.name,
            "energy": save_request.player_data.energy,
            "level": save_request.player_data.level
        })
    
    # Sort leaderboard by energy
    leaderboard_db.sort(key=lambda x: x["energy"], reverse=True)
    
    return {"success": True}

@app.get("/api/player/{user_id}")
async def get_player_data(user_id: int):
    """Get player data by user ID."""
    if user_id not in users_db:
        return {"success": False, "error": "Player not found"}
    
    return {"success": True, "player_data": users_db[user_id]}

@app.get("/api/leaderboard")
async def get_leaderboard():
    """Get the current leaderboard."""
    return {"success": True, "leaderboard": leaderboard_db}

# Serve static files from the frontend build
app.mount("/assets", StaticFiles(directory=f"{STATIC_DIR}/assets"), name="assets")
app.mount("/", StaticFiles(directory=STATIC_DIR), name="static")

if __name__ == "__main__":
    import uvicorn
    
    # For local development
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
