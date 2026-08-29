from datetime import datetime, timezone, timedelta
import sys
import os

# Backend directory
BACKEND_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "backend")
)

sys.path.insert(0, BACKEND_DIR)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import models


# Explicitly use the backend database
DATABASE_PATH = os.path.join(
    BACKEND_DIR,
    "url_shortener.db"
)

DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

models.Base.metadata.create_all(bind=engine)


def seed_database():

    db = SessionLocal()

    try:

        seed_urls = [
            {
                "original_url": "https://www.google.com/",
                "short_code": "Google1",
                "click_count": 3,
                "days_ago": 9,
            },
            {
                "original_url": "https://www.youtube.com/",
                "short_code": "Youtube1",
                "click_count": 7,
                "days_ago": 8,
            },
            {
                "original_url": "https://github.com/",
                "short_code": "Github1",
                "click_count": 2,
                "days_ago": 7,
            },
            {
                "original_url": "https://www.wikipedia.org/",
                "short_code": "Wiki01",
                "click_count": 9,
                "days_ago": 6,
            },
            {
                "original_url": "https://stackoverflow.com/",
                "short_code": "Stack01",
                "click_count": 5,
                "days_ago": 5,
            },
            {
                "original_url": "https://www.python.org/",
                "short_code": "Python1",
                "click_count": 12,
                "days_ago": 4,
            },
            {
                "original_url": "https://www.microsoft.com/",
                "short_code": "Micro01",
                "click_count": 4,
                "days_ago": 3,
            },
            {
                "original_url": "https://www.apple.com/",
                "short_code": "Apple01",
                "click_count": 8,
                "days_ago": 2,
            },
            {
                "original_url": "https://www.linkedin.com/",
                "short_code": "Link01",
                "click_count": 6,
                "days_ago": 1,
            },
            {
                "original_url": "https://www.mozilla.org/",
                "short_code": "Moz01",
                "click_count": 10,
                "days_ago": 0,
            },
        ]

        for data in seed_urls:

            existing = (
                db.query(models.Url)
                .filter(
                    models.Url.short_code
                    == data["short_code"]
                )
                .first()
            )

            if existing:
                print(
                    f"Skipped {data['short_code']} - already exists"
                )
                continue

            creation_date = (
                datetime.now(timezone.utc)
                - timedelta(days=data["days_ago"])
            )

            url = models.Url(
                original_url=data["original_url"],
                short_code=data["short_code"],
                click_count=data["click_count"],
                created_at=creation_date,
            )

            db.add(url)
            db.flush()

            # Create click events
            for i in range(data["click_count"]):

                click_date = (
                    creation_date
                    + timedelta(hours=(i + 1) * 2)
                )

                now = datetime.now(timezone.utc)

                if click_date > now:
                    click_date = (
                        now - timedelta(minutes=i + 1)
                    )

                event = models.ClickEvent(
                    url_id=url.id,
                    clicked_at=click_date,
                )

                db.add(event)

        db.commit()

        print("\nSeed data loaded successfully!\n")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()