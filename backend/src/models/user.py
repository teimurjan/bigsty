from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

from src.models.base import BaseModel


class User(BaseModel):
    __tablename__ = 'user'

    email = Column(String(80), unique=True, nullable=False)
    name = Column(String(60), nullable=False)
    password = Column(String(60), nullable=False)
    group_id = Column(
        Integer,
        ForeignKey(
            'group.id'
        ),
        nullable=False
    )
    group = relationship("Group", lazy='joined')
