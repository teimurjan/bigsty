from api.services.decorators import allow_roles


class FeatureTypeService:
    def __init__(self, repo, name_repo, intl_texts_policy):
        self._repo = repo
        self._name_repo = name_repo
        self._intl_texts_policy = intl_texts_policy

    @allow_roles(['admin', 'manager'])
    def create(self, data, *args, **kwargs):
        if not self._intl_texts_policy.are_valid(data['names']):
            raise self.LanguageInvalid()

        feature_type = self._repo.create()
        for language_id, value in data['names'].items():
            self._name_repo.create(
                language_id=language_id,
                value=value,
                feature_type=feature_type
            )
        return feature_type

    @allow_roles(['admin', 'manager'])
    def update(self, feature_type_id, data, *args, **kwargs):
        feature_type = self.get_one(feature_type_id)

        if not self._intl_texts_policy.are_valid(data['names']):
            raise self.LanguageInvalid()

        for name in feature_type.names:
            new_name = data['names'][str(name.language.id)]
            if new_name != name.value:
                self._name_repo.update(name, new_name)

        return feature_type

    def get_all(self):
        return tuple(self._repo.get_all())

    def get_one(self, id_):
        try:
            return self._repo.get_by_id(id_)
        except self._repo.DoesNotExist:
            raise self.FeatureTypeNotFound()

    @allow_roles(['admin', 'manager'])
    def delete(self, id_):
        try:
            return self._repo.delete(id_)
        except self._repo.DoesNotExist:
            raise self.FeatureTypeNotFound()

    class FeatureTypeNotFound(Exception):
        pass

    class LanguageInvalid(Exception):
        pass
