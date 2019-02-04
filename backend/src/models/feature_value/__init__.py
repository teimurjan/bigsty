from sqlalchemy import Table, Column, String, Integer, ForeignKey, orm
from src.models.base import BaseModel

product_types_m2m_table = Table(
    'product_type_x_feature_value',
    Column('product_type_id', Integer, ForeignKey(
        'product_type.id'), primary_key=True),
    Column('feature_value_id', Integer, ForeignKey(
        'feature_value.id'), primary_key=True)
)

products_m2m_table = Table(
    'product_x_feature_value',
    Column('product_id', Integer, ForeignKey(
        'product.id'), primary_key=True),
    Column('feature_value_id', Integer, ForeignKey(
        'feature_value.id'), primary_key=True)
)


class FeatureValue(BaseModel):
    __tablename__ = 'feature_value'

    names = orm.relationship(
        'FeatureValueName', backref='feature_value', lazy=True
    )
    feature_type_id = Column(
        Integer,
        ForeignKey('feature_type.id'),
        nullable=False
    )
    product_types = orm.relationship(
        'ProductType',
        secondary=product_types_m2m_table,
        lazy='subquery',
        backref=orm.backref('feature_values', lazy=True)
    )
    products = orm.relationship(
        'Product',
        secondary=products_m2m_table,
        lazy='subquery',
        backref=orm.backref('feature_values', lazy=True)
    )
