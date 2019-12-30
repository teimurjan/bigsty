from sqlalchemy import orm, Table, Integer, Column, ForeignKey
from src.models.base import BaseModel

product_types_m2m_table = Table(
    'product_type_x_feature_type',
    BaseModel.metadata,
    Column('product_type_id', Integer, ForeignKey(
        'product_type.id'), primary_key=True),
    Column('feature_type_id', Integer, ForeignKey(
        'feature_type.id'), primary_key=True)
)


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
    product_types = orm.relationship(
        'ProductType',
        secondary=product_types_m2m_table,
        lazy='subquery',
        backref=orm.backref('feature_types', lazy='joined')
    )

    def __getitem__(self, key):
        if key == 'names':
            return self.names

        return super().__getitem__(key)
