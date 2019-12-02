from sqlalchemy import orm
from src.models.base import BaseModel
from src.models.category import CategoryXFeatureType


class FeatureType(BaseModel):
    __tablename__ = 'feature_type'

    names = orm.relationship(
        'FeatureTypeName',
        backref='feature_type',
        lazy='joined',
        cascade="all, delete, delete-orphan"
    )
    feature_values = orm.relationship(
        "FeatureValue",
        lazy='subquery',
        cascade="all, delete, delete-orphan"
    )
    categories = orm.relationship(
        'Category',
        secondary=CategoryXFeatureType,
        lazy='subquery',
    )

    def __getitem__(self, key):
        if key == 'names':
            return self.names

        return super().__getitem__(key)
