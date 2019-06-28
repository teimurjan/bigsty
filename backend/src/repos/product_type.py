from src.repos.base import Repo
from src.models import ProductType, ProductTypeName, ProductTypeDescription, ProductTypeShortDescription, Category
from src.file_storage import FileStorage


class ProductTypeRepo(Repo):
    def __init__(self, db_conn, file_storage: FileStorage):
        super().__init__(db_conn, ProductType)
        self.__file_storage = file_storage

    @Repo.with_session
    def add_product_type(
        self,
        names,
        descriptions,
        short_descriptions,
        image,
        category,
        feature_values,
        session
    ):
        product_type = ProductType()

        for language_id, value in names.items():
            name = ProductTypeName()
            name.value = value
            name.language_id = int(language_id)
            product_type.names.append(name)

        for language_id, value in descriptions.items():
            description = ProductTypeDescription()
            description.value = value
            description.language_id = int(language_id)
            product_type.descriptions.append(description)

        for language_id, value in short_descriptions.items():
            short_description = ProductTypeShortDescription()
            short_description.value = value
            short_description.language_id = int(language_id)
            product_type.short_descriptions.append(short_description)

        for feature_value in feature_values:
            product_type.feature_values.append(feature_value)

        product_type.category_id = category.id

        product_type.image = self.__file_storage.save_file(image)

        session.add(product_type)

        session.flush()

        product_type.category = category

        return product_type

    @Repo.with_session
    def update_product_type(
        self,
        id_,
        names,
        descriptions,
        short_descriptions,
        image,
        category,
        feature_values,
        session
    ):
        product_type = self.get_by_id(id_, session=session)

        for name in product_type.names:
            new_name = names[str(name.language_id)]
            if name.value != new_name:
                name.value = new_name

        for description in product_type.descriptions:
            new_description = descriptions[str(description.language_id)]
            if description.value != new_description:
                description.value = new_description

        for short_description in product_type.short_descriptions:
            new_short_description = short_descriptions[str(
                short_description.language_id)]
            if short_description.value != new_short_description:
                short_description.value = new_short_description

        product_type.feature_values = feature_values

        product_type.category = category

        if image is not None:
            product_type.image = self.__file_storage.save_file(image)

        return product_type

    @Repo.with_session
    def filter_by_category_id(self, category_id, session):
        return (
            session
            .query(ProductType)
            .filter(Category.id == category_id)
            .order_by(ProductType.id).all()
        )

    class DoesNotExist(Exception):
        pass
