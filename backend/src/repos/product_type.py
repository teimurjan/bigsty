from src.repos.base import IntlRepo
from src.models import ProductType, ProductTypeName, ProductTypeDescription, ProductTypeShortDescription, Category
from src.file_storage import FileStorage


class ProductTypeRepo(IntlRepo):
    def __init__(self, db_conn, file_storage: FileStorage):
        super().__init__(db_conn, ProductType)
        self.__file_storage = file_storage

    @IntlRepo.with_session
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

    @IntlRepo.with_session
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

    @IntlRepo.with_session
    def filter_by_category_id(self, category_id, session):
        return (
            session
            .query(ProductType)
            .filter(ProductType.category_id.in_([category_id]))
            .order_by(ProductType.id)
            .all()
        )

    class DoesNotExist(Exception):
        pass
