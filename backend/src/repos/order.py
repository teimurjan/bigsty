import bcrypt

from src.repos.base import Repo, with_session
from src.models import Order, OrderItem


class OrderRepo(Repo):
    def __init__(self, db_conn):
        super().__init__(db_conn, Order)

    @with_session
    def get_for_user(self, user_id, session):
        return session.query(Order).filter(Order.user_id == user_id).all()
    
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

    class DoesNotExist(Exception):
        pass