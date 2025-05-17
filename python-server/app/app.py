from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "FastAPI server running on Docker - Port 7000"}

@app.get("/status")
async def get_status():
    return {"status": "running", "port": 7000}
