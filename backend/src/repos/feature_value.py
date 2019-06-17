from src.repos.base import Repo
from src.models import FeatureValue, FeatureValueName, FeatureType


class FeatureValueRepo(Repo):
    def __init__(self, db_conn):
        super().__init__(db_conn, FeatureValue)

    @Repo.with_session
    def add_feature_value(self, names, feature_type, session):
        feature_value = FeatureValue()

        for language_id, value in names.items():
            name = FeatureValueName()
            name.value = value
            name.language_id = int(language_id)
            feature_value.names.append(name)

        feature_value.feature_type_id = feature_type.id

        session.add(feature_value)

        session.flush()

        feature_value.names
        feature_value.feature_type

        return feature_value

    @Repo.with_session
    def update_feature_value(self, id_, names, feature_type, session):
        feature_value = self.get_by_id(id_, session=session)

        for name in feature_value.names:
            new_name = names[str(name.language_id)]
            if name.value != new_name:
                name.value = new_name

        feature_value.feature_type_id = feature_type.id

        return feature_value

    @Repo.with_session
    def filter_by_ids(self, ids, session):
        return session.query(FeatureValue).filter(FeatureValue.id.in_(ids)).all()

    class DoesNotExist(Exception):
        pass