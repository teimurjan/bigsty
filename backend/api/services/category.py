from api.services.decorators import allow_roles


class CategoryService:
    def __init__(self, repo, name_repo, feature_type_repo, intl_texts_policy):
        self._repo = repo
        self._name_repo = name_repo
        self._intl_texts_policy = intl_texts_policy
        self._feature_type_repo = feature_type_repo

    def get_all(self):
        return tuple(self._repo.get_all())

    def get_one(self, id_):
        try:
            return self._repo.get_by_id(id_)
        except self._repo.DoesNotExist:
            raise self.CategoryNotFound()

    # @allow_roles(['admin', 'manager'])
    def create(self, data, *args, **kwargs):
        try:
            if not self._intl_texts_policy.are_valid(data['names']):
                raise self.LanguageInvalid()

            feature_types = self._feature_type_repo.get_by_ids(
                data['feature_types']
            )

            category = self._repo.create()
            for language_id, value in data['names'].items():
                self._name_repo.create(
                    language_id=language_id,
                    value=value,
                    category=category
                )

            self._repo.set_feature_types(category, feature_types)

            return category
        except self._feature_type_repo.DoesNotExist:
            raise self.FeatureTypeInvalid()

    # @allow_roles(['admin', 'manager'])
    def update(self, category_id, data, *args, **kwargs):
        try:
            category = self.get_one(category_id)

            if not self._intl_texts_policy.are_valid(data['names']):
                raise self.LanguageInvalid()

            feature_types = self._feature_type_repo.get_by_ids(
                data['feature_types']
            )

            for name in category.names:
                new_name = data['names'][str(name.language.id)]
                if new_name != name.value:
                    self._name_repo.update(name, new_name)

            self._repo.set_feature_types(category, feature_types)

            return category
        except self._repo.DoesNotExist:
            raise self.CategoryNotFound()

    # @allow_roles(['admin', 'manager'])
    def delete(self, id_):
        try:
            return self._repo.delete(id_)
        except self._repo.DoesNotExist:
            raise self.CategoryNotFound()

    class LanguageInvalid(Exception):
        pass

    class CategoryNotFound(Exception):
        pass

    class FeatureTypeInvalid(Exception):
        pass
