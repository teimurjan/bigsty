from sqlalchemy import Table, Column, String, Integer, ForeignKey, orm
from src.models.base import BaseModel

CategoryXFeatureType = Table(
    'category_x_feature_type',
    BaseModel.metadata,
    Column('category_id', Integer, ForeignKey(
        'category.id'), primary_key=True),
    Column('feature_type_id', Integer, ForeignKey(
        'feature_type.id'), primary_key=True)
)


class Category(BaseModel):
    __tablename__ = 'category'

    names = orm.relationship(
        'CategoryName',
        backref='category',
        lazy='joined',
        cascade="all, delete, delete-orphan"
    )
    product_types = orm.relationship('ProductType', lazy=True)
    feature_types = orm.relationship(
        'FeatureType',
        secondary=CategoryXFeatureType,
        lazy='subquery',
    )
    parent_category_id = Column(
        Integer,
        ForeignKey('category.id'),
        nullable=True
    )

    def __getitem__(self, key):
        if key == 'names':
            return self.names

        return super().__getitem__(key)
