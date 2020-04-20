from sqlalchemy import Column, ForeignKey, Integer, String, Table, orm
from sqlalchemy.sql.expression import select

from src.models.base import BaseModel
from src.models.product import Product


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
        lazy='select',
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
    slug = Column(String(255), nullable=False, unique=True)

    def __getitem__(self, key):
        if key == 'names':
            return self.names
        if key == 'descriptions':
            return self.descriptions
        if key == 'short_descriptions':
            return self.short_descriptions

        return super().__getitem__(key)
