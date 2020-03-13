from sqlalchemy import Table, Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from src.models.base import BaseModel


class Order(BaseModel):
    __tablename__ = 'order'

    user_name = Column(String(255), nullable=False)
    user_phone_number = Column(String(255), nullable=False)
    user_address = Column(String(255), nullable=False)
    user_id = Column(
        Integer,
        ForeignKey('user.id'),
        nullable=True
    )
    user = relationship("User", lazy='joined')
    items = relationship(
        'OrderItem',
        backref='order',
        lazy='joined',
    )
    # statuses are: idle, approved, rejected, completed
    status = Column(String(60), default='idle', nullable=False)

