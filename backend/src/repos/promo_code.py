from sqlalchemy.orm.query import aliased
from sqlalchemy.orm import joinedload

from src.models import PromoCode
from src.repos.base import NonDeletableRepo, with_session


class PromoCodeRepo(NonDeletableRepo):
    def __init__(self, db_conn):
        super().__init__(db_conn, PromoCode)

    @with_session
    def add_promo_code(self, value, discount, is_active, disable_on_use, products, session):
        if self.is_value_used(value):
            raise self.ValueNotUnique()

        promo_code = PromoCode()
        promo_code.value = value
        promo_code.discount = discount
        promo_code.is_active = is_active
        promo_code.disable_on_use = disable_on_use
        promo_code.products = products

        session.add(promo_code)

        session.flush()

        return promo_code

    @with_session
    def update_promo_code(self, id_, is_active, disable_on_use, products, session):
        promo_code = self.get_by_id(id_, False, session=session)

        promo_code.is_active = is_active
        promo_code.disable_on_use = disable_on_use
        promo_code.products = products
        session.flush()

        return promo_code

    @with_session
    def is_value_used(self, value, session):
        return session.query(PromoCode).filter(PromoCode.value == value).count() > 0

    @with_session
    def get_by_value(self, value, join_products, session):
        q = self.get_non_deleted_query()
        if join_products:
            q = (
                q
                .options(joinedload(PromoCode.products))
                .outerjoin(PromoCode.products)
            )

        objects = q.filter(PromoCode.value == value).all()
        if len(objects) == 0:
            raise self.DoesNotExist()

        return objects[0]

    @with_session
    def get_by_id(self, id_, join_products, session):
        q = session.query(PromoCode)
        if join_products:
            q = (
                q
                .options(joinedload(PromoCode.products))
                .outerjoin(PromoCode.products)
            )

        objects = q.filter(PromoCode.id == id_).all()
        if len(objects) == 0:
            raise self.DoesNotExist()

        return objects[0]

    class DoesNotExist(Exception):
        pass

    class ValueNotUnique(Exception):
        pass
