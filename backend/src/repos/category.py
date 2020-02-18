from sqlalchemy.orm.query import aliased

from src.models import Category, CategoryName, FeatureType
from src.repos.base import IntlRepo, with_session


class CategoryRepo(IntlRepo):
    def __init__(self, db_conn):
        super().__init__(db_conn, Category)

    @with_session
    def add_category(self, names, parent_category_id, session):
        category = Category()
        category.parent_category_id = parent_category_id

        self._add_intl_texts(names, category, 'names', CategoryName)

        session.add(category)

        session.flush()

        return category

    @with_session
    def update_category(self, id_, names, parent_category_id, session):
        category = self.get_by_id(id_, session=session)
        category.parent_category_id = parent_category_id

        self._update_intl_texts(names, category, 'names', CategoryName)

        session.flush()

        return category

    @with_session
    def get_children(self, id_, session):
        category_recursive_query = session.query(Category).filter(
            Category.id == id_).cte(recursive=True)

        category_alias = aliased(category_recursive_query, name="parent")
        children_alias = aliased(Category, name='children')

        final_query = category_recursive_query.union_all(
            session.query(children_alias).filter(
                children_alias.parent_category_id == category_alias.c.id)
        )

        return session.query(final_query).all()

    @with_session
    def has_children(self, id_, session):
        return session.query(Category).filter(Category.parent_category_id == id_).count() > 0

    class DoesNotExist(Exception):
        pass
