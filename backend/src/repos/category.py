from src.repos.base import IntlRepo
from src.models import Category, CategoryName, FeatureType


class CategoryRepo(IntlRepo):
    def __init__(self, db_conn):
        super().__init__(db_conn, Category)

    @IntlRepo.with_session
    def add_category(self, names, parent_category_id, session):
        category = Category()
        category.parent_category_id = parent_category_id

        self._add_intl_texts(names, category, 'names', CategoryName)

        session.add(category)

        session.flush()

        return category

    @IntlRepo.with_session
    def update_category(self, id_, names, parent_category_id, session):
        category = self.get_by_id(id_, session=session)
        category.parent_category_id = parent_category_id

        self._update_intl_texts(names, category, 'names', CategoryName)

        session.flush()

        return category

    class DoesNotExist(Exception):
        pass
