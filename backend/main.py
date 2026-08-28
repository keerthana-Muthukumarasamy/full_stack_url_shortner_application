from fastapi import Depends,FastAPI
from sqlalchemy.orm import Session

from database import Base, engine,get_db
import models
from schemas import URLCreate
import secrets
import string
from fastapi import HTTPException
from fastapi.responses import RedirectResponse

Base.metadata.create_all(bind=engine)

app = FastAPI()

def generate_short_code(length: int =6)-> str:
    characters = string.ascii_letters + string.digits
    return "".join(secrets.choice(characters) for _ in range(length))


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

@app.get("/api/urls")
def get_urls(
    db: Session = Depends(get_db)
):
    urls = (
        db.query(models.Url)
        .order_by(models.Url.created_at.desc())
        .all()
    )

    return urls


@app.get("/{short_code}")
def redirect_url(
    short_code: str,
    db: Session = Depends(get_db)
):
    url = db.query(models.Url).filter(
        models.Url.short_code == short_code
    ).first()

    if not url:
        raise HTTPException(
            status_code=404,
            detail="Short URL not found"
        )

    url.click_count += 1

    click_event = models.ClickEvent(
        url_id=url.id
    )

    db.add(click_event)
    db.commit()

    return RedirectResponse(
        url=url.original_url,
        status_code=307
    )


