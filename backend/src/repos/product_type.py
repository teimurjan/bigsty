from sqlalchemy.orm import joinedload

from src.storage.base import Storage
from src.models import (ProductType, ProductTypeDescription,
                        ProductTypeName, ProductTypeShortDescription)
from src.repos.base import IntlRepo, with_session


class ProductTypeRepo(IntlRepo):
    def __init__(self, db_conn, file_storage: Storage):
        super().__init__(db_conn, ProductType)
        self.__file_storage = file_storage

    @with_session
    def add_product_type(
        self,
        names,
        descriptions,
        short_descriptions,
        image,
        category,
        feature_types,
        session
    ):
        product_type = ProductType()

        self._add_intl_texts(names, product_type, 'names', ProductTypeName)
        self._add_intl_texts(descriptions, product_type,
                             'descriptions', ProductTypeDescription)
        self._add_intl_texts(short_descriptions, product_type,
                             'short_descriptions', ProductTypeShortDescription)

        for feature_type in feature_types:
            product_type.feature_types.append(feature_type)

        product_type.category_id = category.id

        product_type.image = self.__file_storage.save_file(image)

        session.add(product_type)

        session.flush()

        product_type.category = category

        return product_type

    @with_session
    def update_product_type(
        self,
        id_,
        names,
        descriptions,
        short_descriptions,
        image,
        category,
        feature_types,
        session
    ):
        product_type = self.get_by_id(id_, session=session)

        self._update_intl_texts(names, product_type, 'names', ProductTypeName)
        self._update_intl_texts(
            descriptions, product_type, 'descriptions', ProductTypeDescription)
        self._update_intl_texts(short_descriptions, product_type,
                                'short_descriptions', ProductTypeShortDescription)

        product_type.feature_types = feature_types

        product_type.category = category

        if image is not None:
            product_type.image = (image
                                  if isinstance(image, str)
                                  else self.__file_storage.save_file(image))

        return product_type

    @with_session
    def get_for_categories_with_products(self, category_ids, offset, limit, session):
        return (
            session
            .query(ProductType)
            .options(joinedload(ProductType.products))
            .filter(ProductType.category_id.in_(category_ids))
            .order_by(ProductType.id)
            .offset(offset)
            .limit(limit)
            .all()
        )

    @with_session
    def has_with_category(self, id_, session):
        return session.query(ProductType).filter(ProductType.category_id == id_).count() > 0

    class DoesNotExist(Exception):
        pass
