from sqlalchemy import Column, String, orm, Integer, ForeignKey
from sqlalchemy.ext.declarative import declared_attr
from src.models.base import BaseModel


class IntlText(BaseModel):
    __abstract__ = True

    @declared_attr
    def language_id(cls):
        return Column(
            Integer,
            ForeignKey(
                'language.id'
            ),
            nullable=False
        )


class Language(BaseModel):
    __tablename__ = 'language'

    name = Column(String(10), nullable=False, unique=True)
