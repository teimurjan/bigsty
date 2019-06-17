from src.repos.base import Repo
from src.models import FeatureType, FeatureTypeName, Category


class FeatureTypeRepo(Repo):
    def __init__(self, db_conn):
        super().__init__(db_conn, FeatureType)

    @Repo.with_session
    def add_feature_type(self, names, session):
        feature_type = FeatureType()

        for language_id, value in names.items():
            name = FeatureTypeName()
            name.value = value
            name.language_id = int(language_id)
            feature_type.names.append(name)

        session.add(feature_type)

        session.flush()

        feature_type.names

        return feature_type

    @Repo.with_session
    def update_feature_type(self, id_, names, session):
        feature_type = self.get_by_id(id_, session=session)

        for name in feature_type.names:
            new_name = names[str(name.language_id)]
            if name.value != new_name:
                name.value = new_name

        return feature_type

    @Repo.with_session
    def filter_by_ids(self, ids, session):
        return session.query(FeatureType).filter(FeatureType.id.in_(ids)).all()

    @Repo.with_session
    def filter_by_category(self, category, session):
        return (
            session
            .query(FeatureType)
            .filter(FeatureType.categories.any(Category.id == category.id))
            .all()
        )

    class DoesNotExist(Exception):
        pass