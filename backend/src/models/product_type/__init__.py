from sqlalchemy import Column, String, orm, Integer, ForeignKey
from src.models.base import BaseModel


class ProductType(BaseModel):
    __tablename__ = 'product_type'

    names = orm.relationship(
        'ProductTypeName',
        backref='product_type',
        lazy='joined',
        cascade="all, delete, delete-orphan"
    )
    descriptions = orm.relationship(
        'ProductTypeDescription',
        backref='product_type',
        lazy='joined',
        cascade="all, delete, delete-orphan"
    )
    short_descriptions = orm.relationship(
        'ProductTypeShortDescription',
        backref='product_type',
        lazy='joined',
        cascade="all, delete, delete-orphan"
    )
    products = orm.relationship(
        'Product',
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
    category = orm.relationship("Category", lazy='joined')
