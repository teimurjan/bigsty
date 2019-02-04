from sqlalchemy import Column, String, Integer, ForeignKey, func, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class BaseModel(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True)
    created_on = Column(DateTime, default=func.now())
    updated_on = Column(
        DateTime,
        default=func.now(),
        onupdate=func.now()
    )
