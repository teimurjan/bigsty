import bcrypt

from sqlalchemy.orm import joinedload

from src.models import Order, OrderItem
from src.models.order import order_item
from src.repos.base import Repo, with_session


class OrderRepo(Repo):
    def __init__(self, db_conn):
        super().__init__(db_conn, Order)

    @with_session
    def get_for_user(self, user_id, session):
        return session.query(Order).filter(Order.user_id == user_id).all()

    @with_session
    def get_by_id(self, id_, session) -> Order:
        obj = session.query(Order).options(joinedload(Order.items)).get(id_)
        if obj is None:
            raise self.DoesNotExist()

        return obj

    @with_session
    def add_order(self, user, user_name, user_phone_number, user_address, items, session):
        order = Order()
        order.user = user
        order.user_name = user_name
        order.user_phone_number = user_phone_number
        order.user_address = user_address

        order_items = []
        for item in items:
            order_item = OrderItem()
            order_item.product = item['product']
            order_item.product_price_per_item = item['product'].price
            order_item.product_discount = item['product'].discount
            order_item.quantity = item['quantity']
            order_items.append(order_item)

        order.items = order_items

        session.add(order)
        session.flush()

        order.created_on

        return order

    @with_session
    def update_order(self, id_, user_name, user_phone_number, user_address, items, status, session):
        order = self.get_by_id(id_, session=session)
        order.user_name = user_name
        order.user_phone_number = user_phone_number
        order.user_address = user_address
        order.status = status

        new_order_items = []
        for item in items:
            order_item = OrderItem()
            order_item.product = item['product']
            order_item.product_price_per_item = item['product'].price
            order_item.product_discount = item['product'].discount
            order_item.quantity = item['quantity']
            new_order_items.append(order_item)

        order.items = new_order_items

        session.add(order)
        session.flush()

        order.created_on

        return order

    class DoesNotExist(Exception):
        pass
