from src.repos.base import IntlRepo, with_session
from src.models import FeatureType, FeatureTypeName, Category


class FeatureTypeRepo(IntlRepo):
    def __init__(self, db_conn):
        super().__init__(db_conn, FeatureType)

    @with_session
    def add_feature_type(self, names, session):
        feature_type = FeatureType()

        self._add_intl_texts(names, feature_type, 'names', FeatureTypeName)

        session.add(feature_type)

        session.flush()

        feature_type.names

        return feature_type

    @with_session
    def update_feature_type(self, id_, names, session):
        feature_type = self.get_by_id(id_, session=session)

        self._update_intl_texts(names, feature_type, 'names', FeatureTypeName)

        return feature_type

    @with_session
    def filter_by_category(self, category, session):
        return (
            session
            .query(FeatureType)
            .filter(FeatureType.categories.any(Category.id == category.id))
            .all()
        )

    class DoesNotExist(Exception):
        pass