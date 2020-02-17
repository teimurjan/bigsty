from src.repos.base import IntlRepo
from src.models import FeatureValue, FeatureValueName, FeatureType


class FeatureValueRepo(IntlRepo):
    def __init__(self, db_conn):
        super().__init__(db_conn, FeatureValue)

    @IntlRepo.with_session
    def add_feature_value(self, names, feature_type, session):
        feature_value = FeatureValue()

        self._add_intl_texts(names, feature_value, 'names', FeatureValueName)

        feature_value.feature_type_id = feature_type.id

        session.add(feature_value)

        session.flush()

        feature_value.names
        feature_value.feature_type

        return feature_value

    @IntlRepo.with_session
    def update_feature_value(self, id_, names, feature_type, session):
        feature_value = self.get_by_id(id_, session=session)
        
        self._update_intl_texts(names, feature_value, 'names', FeatureValueName)

        feature_value.feature_type_id = feature_type.id

        return feature_value

    class DoesNotExist(Exception):
        pass