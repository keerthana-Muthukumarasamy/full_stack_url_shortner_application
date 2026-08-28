from fastapi import Depends,FastAPI
from sqlalchemy.orm import Session

from database import Base, engine,get_db
import models
from schemas import URLCreate
import secrets
import string
from fastapi import HTTPException
from fastapi.responses import RedirectResponse
from datetime import datetime, timezone

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



@app.get("/api/analytics")
def get_analytics(
    db: Session = Depends(get_db)
):
    urls = db.query(models.Url).all()

    total_urls = len(urls)

    total_clicks = sum(
        url.click_count for url in urls
    )

    today = datetime.now(timezone.utc).date()

    today_clicks = 0

    click_activity = {}
    creation_activity = {}

    for url in urls:

        # Count URL creation by date
        creation_date = url.created_at.date().isoformat()

        if creation_date not in creation_activity:
            creation_activity[creation_date] = 0

        creation_activity[creation_date] += 1

        # Count clicks by date
        for event in url.click_events:
            click_date = event.clicked_at.date().isoformat()

            if click_date == today.isoformat():
                today_clicks += 1

            if click_date not in click_activity:
                click_activity[click_date] = 0

            click_activity[click_date] += 1

    all_dates = sorted(
        set(click_activity) | set(creation_activity)
    )

    activity = [
        {
            "date": date,
            "clicks": click_activity.get(date, 0),
            "creations": creation_activity.get(date, 0)
        }
        for date in all_dates
    ]

    return {
        "total_urls": total_urls,
        "total_clicks": total_clicks,
        "today_clicks": today_clicks,
        "activity": activity
    }



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


