from src.repos.base import Repo
from src.models import Category, CategoryName, FeatureType


class CategoryRepo(Repo):
    def __init__(self, db_conn):
        super().__init__(db_conn, Category)

    @Repo.with_session
    def add_category(self, names, parent_category_id, feature_types, session):
        category = Category()
        category.parent_category_id = parent_category_id

        for feature_type in feature_types:
            category.feature_types.append(feature_type)

        for language_id, value in names.items():
            name = CategoryName()
            name.value = value
            name.language_id = int(language_id)
            name.category_id = category.id
            category.names.append(name)

        session.add(category)

        session.flush()

        return category

    @Repo.with_session
    def update_category(self, id_, names, parent_category_id, feature_types, session):
        category = self.get_by_id(id_, session=session)
        category.parent_category_id = parent_category_id

        category.feature_types = feature_types

        for name in category.names:
            new_name = names[str(name.language_id)]
            if name.value != new_name:
                name.value = new_name

        session.flush()

        return category

    class DoesNotExist(Exception):
        pass
