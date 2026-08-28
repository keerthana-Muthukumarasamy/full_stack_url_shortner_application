from fastapi import Depends,FastAPI
from sqlalchemy.orm import Session

from database import Base, engine,get_db
import models
from schemas import URLCreate
import secrets
import string

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def root():
    return {"message": "URL Shortener API is running"}


@app.post("/api/urls")
def create_url(
    url_data: URLCreate,
    db: Session = Depends(get_db)
):
    short_code = generate_short_code()
    while db.query(models.Url).filter(models.Url.short_code ==short_code).first():
        short_code=generate_short_code()

    new_url = models.Url(
        original_url=str(url_data.original_url),
        short_code=short_code
    )
    db.add(new_url)
    db.commit()
    db.refresh(new_url)
    return {
        "original_url": new_url.original_url,
        "short_code": new_url.short_code,
        "short_url": f"http://localhost:8000/{new_url.short_code}",
    }
def generate_short_code(length: int =6)-> str:
    characters = string.ascii_letters + string.digits
    return "".join(secrets.choice(characters) for _ in range(length))
