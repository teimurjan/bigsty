from sqlalchemy import Column, String, Integer, ForeignKey
from src.models.intl import IntlText


class ProductTypeDescription(IntlText):
    __tablename__ = 'product_type_description'

    value = Column(String(50), nullable=False)
    product_type_id = Column(
        Integer,
        ForeignKey(
            'product_type.id'
        ),
        nullable=False
    )
