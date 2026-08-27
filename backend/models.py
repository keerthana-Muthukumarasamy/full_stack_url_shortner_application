from datetime import datetime,timezone
from sqlalchemy import Column, Integer, String, DateTime , ForeignKey
from sqlalchemy.orm import relationship

from .database import Base

class Url(Base):
    __tablename__ = "urls"

    id = Column(Integer, primary_key=True, index=True)
    original_url = Column(String, nullable=False)
    short_code = Column(String, unique=True, nullable=False,index=True)
    created_at = Column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        nullable=False)
    click_count= Column(Integer, default=0, nullable=False)

    click_events = relationship(
        "ClickEvent",
        back_populates="url"
    )

class ClickEvent(Base):
    __tablename__ = "click_events"

    id = Column(Integer, primary_key=True, index=True)
    url_id = Column(
        Integer,
        ForeignKey("urls.id"),
        nullable=False
    )
    clicked_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    url = relationship(
        "Url",
        back_populates="click_events"
    )