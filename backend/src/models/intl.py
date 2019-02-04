from sqlalchemy import Column, String, orm, Integer, ForeignKey
from sqlalchemy.ext.declarative import declared_attr
from src.models.base import BaseModel


class Language(BaseModel):
    __tablename__ = 'language'

    name = Column(String(10), nullable=False, unique=True)
    texts = orm.relationship('IntlText', backref='language', lazy=True)


class IntlText(BaseModel):
    __abstract__ = True

    @declared_attr
    @classmethod
    def language_id(cls):
        return Column(
            Integer,
            ForeignKey(
                'language.id'
            ),
            nullable=False
        )
