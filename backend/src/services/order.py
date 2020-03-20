from flask import current_app as app, render_template

from src.mail import Mail
from src.policies.feature_values import FeatureValuesPolicy
from src.repos.feature_value import FeatureValueRepo
from src.repos.order import OrderRepo
from src.repos.product import ProductRepo
from src.repos.product_type import ProductTypeRepo
from src.services.decorators import allow_roles


class OrderService:
    def __init__(
        self,
        repo: OrderRepo,
        product_repo: ProductRepo,
        mail: Mail
    ):
        self._repo = repo
        self._product_repo = product_repo
        self._mail = mail

    def create(self, data, user):
        try:
            with self._repo.session() as s:
                for item in data['items']:
                    product = self._product_repo.get_by_id(
                        item['product_id'],
                        session=s
                    )
                    item['product'] = product

                order = self._repo.add_order(
                    user,
                    data['user_name'],
                    data['user_phone_number'],
                    data['user_address'],
                    data['items'],
                    session=s
                )

                link = app.config.get('HOST') + '/admin/orders/' + str(order.id)

                title = 'Заказ!'
                description = 'Имя: ' + order.user_name + '<br/>' + 'Телефон: ' + order.user_phone_number + '<br/>' + 'Адрес: ' + order.user_address
                link_text = 'Подробнее'
                subject = link_text
                body = render_template('link_email.html', link=link,
                                    title=title, description=description, link_text=link_text)

                self._mail.send(subject, body, [app.config.get('MAIL_ORDERS_USERNAME')])

                return order
        except self._product_repo.DoesNotExist:
            raise self.ProductInvalid()

    @allow_roles(['admin', 'manager'])
    def get_all(self, offset=None, limit=None, user=None):
        return self._repo.get_all(offset=offset, limit=limit)

    def get_by_ids(self, ids):
        return self._repo.filter_by_ids(ids)

    def get_for_user(self, user_id):
        return self._repo.get_for_user(user_id)

    class ProductInvalid(Exception):
        pass
