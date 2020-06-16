from sqlalchemy import Table, Column, String, Integer, ForeignKey, orm, Boolean
from src.models.base import NonDeletableModel, BaseModel

ProductXPromoCodeTable = Table(
    'product_x_promo_code',
    BaseModel.metadata,
    Column('product_id', Integer, ForeignKey(
        'product.id'), primary_key=True),
    Column('promo_code_id', Integer, ForeignKey(
        'promo_code.id'), primary_key=True)
)


class PromoCode(NonDeletableModel):
    __tablename__ = 'promo_code'

    value = Column(String(60), unique=True, nullable=False)
    discount = Column(Integer, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    disable_on_use = Column(Boolean, nullable=False, default=True)
    products = orm.relationship(
        'Product',
        secondary=ProductXPromoCodeTable,
        lazy='select',
        backref=orm.backref('promo_codes')
    )
