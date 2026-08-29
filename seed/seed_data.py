from datetime import datetime, timezone, timedelta
import sys
import os

# Allow importing backend modules
sys.path.append(
    os.path.join(os.path.dirname(__file__), "..", "backend")
)

from database import SessionLocal
import models


def seed_database():
    db = SessionLocal()

    try:
        # Don't add duplicate seed URLs
        existing_codes = {
            url.short_code
            for url in db.query(models.Url).all()
        }

        seed_urls = [
            {
                "original_url": "https://www.google.com/",
                "short_code": "Google1",
                "click_count": 3,
            },
            {
                "original_url": "https://www.youtube.com/",
                "short_code": "Youtube1",
                "click_count": 5,
            },
            {
                "original_url": "https://github.com/",
                "short_code": "Github1",
                "click_count": 2,
            },
            {
                "original_url": "https://www.wikipedia.org/",
                "short_code": "Wiki01",
                "click_count": 4,
            },
        ]

        created_urls = []

        for data in seed_urls:
            if data["short_code"] in existing_codes:
                continue

            url = models.Url(
                original_url=data["original_url"],
                short_code=data["short_code"],
                click_count=data["click_count"],
                created_at=datetime.now(timezone.utc),
            )

            db.add(url)
            created_urls.append(url)

        db.commit()

        # Add click events corresponding to click_count
        for url in created_urls:
            for i in range(url.click_count):
                event = models.ClickEvent(
                    url_id=url.id,
                    clicked_at=datetime.now(timezone.utc)
                    - timedelta(minutes=(i + 1) * 10),
                )

                db.add(event)

        db.commit()

        print("Seed data loaded successfully.")

        for url in created_urls:
            print(
                f"{url.short_code} -> "
                f"{url.original_url} "
                f"({url.click_count} clicks)"
            )

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()