from fastapi import FastAPI

app = FastAPI(
    title="FamilyShield AI API"
)

@app.get("/")
def home():
    return {
        "message": "FamilyShield AI Backend Running"
        
    }