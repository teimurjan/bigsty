from api.services.decorators import allow_roles


class FeatureValueService:
    def __init__(self, repo, name_repo, feature_type_repo, intl_texts_policy):
        self._repo = repo
        self._name_repo = name_repo
        self._feature_type_repo = feature_type_repo
        self._intl_texts_policy = intl_texts_policy

    #@allow_roles(['admin', 'manager'])
    def create(self, data, *args, **kwargs):
        try:
            if not self._intl_texts_policy.are_valid(data['names']):
                raise self.LanguageInvalid()

            feature_type = self._feature_type_repo.get_by_id(
                data['feature_type_id']
            )
            feature_value = self._repo.create(feature_type=feature_type)
            for language_id, value in data['names'].items():
                self._name_repo.create(
                    language_id=language_id,
                    value=value,
                    feature_value=feature_value
                )
            return feature_value
        except self._feature_type_repo.DoesNotExist:
            raise self.FeatureTypeInvalid()

    #@allow_roles(['admin', 'manager'])
    def update(self, feature_value_id, data, *args, **kwargs):
        try:
            feature_value = self.get_one(feature_value_id)

            if not self._intl_texts_policy.are_valid(data['names']):
                raise self.LanguageInvalid()

            feature_type = self._feature_type_repo.get_by_id(
                data['feature_type_id']
            )

            self._repo.update(feature_value, feature_type=feature_type)

            for name in feature_value.names:
                new_name = data['names'][str(name.language.id)]
                if new_name != name.value:
                    self._name_repo.update(name, new_name)

            return feature_value
        except self._feature_type_repo.DoesNotExist:
            raise self.FeatureTypeInvalid()

    def get_all(self):
        return self._repo.get_all()

    def get_one(self, id_):
        try:
            return self._repo.get_by_id(id_)
        except self._repo.DoesNotExist:
            raise self.FeatureValueNotFound()

    #@allow_roles(['admin', 'manager'])
    def delete(self, id_):
        try:
            return self._repo.delete(id_)
        except self._repo.DoesNotExist:
            raise self.FeatureValueNotFound()

    class FeatureValueNotFound(Exception):
        pass

    class FeatureTypeInvalid(Exception):
        pass

    class LanguageInvalid(Exception):
        pass
