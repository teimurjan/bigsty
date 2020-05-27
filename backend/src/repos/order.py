import bcrypt

from sqlalchemy.orm import joinedload

from src.models import Order, OrderItem
from src.models.order import order_item
from src.repos.base import NonDeletableRepo, with_session


class OrderRepo(NonDeletableRepo):
    def __init__(self, db_conn):
        super().__init__(db_conn, Order)

    @with_session
    def get_for_user(self, user_id, session):
        return self.get_non_deleted_query(session=session).filter(Order.user_id == user_id).all()

    @with_session
    def get_by_id(self, id_, session) -> Order:
        objects = (
            self
            .get_non_deleted_query(session=session)
            .options(joinedload(Order.items))
            .filter(Order.id == id_)
            .all()
        )
        if len(objects) == 0:
            raise self.DoesNotExist()

        return objects[0]

    @with_session
    def add_order(self, user, user_name, user_phone_number, user_address, items, promo_code, session):
        order = Order()
        order.user = user
        order.user_name = user_name
        order.user_phone_number = user_phone_number
        order.user_address = user_address
        order.promo_code = promo_code

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
    def update_order(self, id_, user_name, user_phone_number, user_address, items, status, promo_code, session):
        order = self.get_by_id(id_, session=session)
        order.user_name = user_name
        order.user_phone_number = user_phone_number
        order.user_address = user_address
        order.status = status
        order.promo_code = promo_code

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
