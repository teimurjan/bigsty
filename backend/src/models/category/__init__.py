from sqlalchemy import Table, Column, String, Integer, ForeignKey, orm
from src.models.base import BaseModel

feature_types_m2m_table = Table(
    'category_x_feature_type',
    Column('category_id', Integer, ForeignKey(
        'category.id'), primary_key=True),
    Column('feature_type_id', Integer, ForeignKey(
        'feature_type.id'), primary_key=True)
)


class Category(BaseModel):
    __tablename__ = 'category'

    names = orm.relationship('CategoryName', backref='category', lazy=True)
    product_types = orm.relationship('ProductType', backref='category', lazy=True)
    feature_types = orm.relationship(
        'FeatureType',
        secondary=feature_types_m2m_table,
        lazy='subquery',
        backref=orm.backref('categories', lazy=True)
    )
