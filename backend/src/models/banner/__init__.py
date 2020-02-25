from sqlalchemy import Column, String, Integer, ForeignKey, orm
from sqlalchemy.orm import relationship

from src.models.base import BaseModel


class Banner(BaseModel):
    __tablename__ = 'banner'

    image = Column(String(255), nullable=False)
    texts = orm.relationship(
        'BannerText',
        backref='banner',
        lazy='joined',
        cascade="all, delete, delete-orphan"
    )
    link = Column(String(255), nullable=True)

    def __getitem__(self, key):
        if key == 'texts':
            return self.texts

        return super().__getitem__(key)
