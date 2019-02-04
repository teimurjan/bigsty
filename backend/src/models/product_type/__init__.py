from sqlalchemy import Column, String, orm, Integer, ForeignKey
from src.models.base import BaseModel

class ProductType(BaseModel):
    __tablename__ = 'product_type'

    names = orm.relationship(
        'ProductTypeName',
        backref='product_type',
        lazy=True
    )
    descriptions = orm.relationship(
        'ProductTypeDescription',
        backref='product_type',
        lazy=True
    )
    short_descriptions = orm.relationship(
        'ProductTypeShortDescription',
        backref='product_type',
        lazy=True
    )
    products = orm.relationship(
        'Product',
        backref='product_type',
        lazy=True
    )
    image = Column(String(255), nullable=True)
    category_id = Column(
        Integer,
        ForeignKey(
            'category.id'
        ),
        nullable=False
    )
