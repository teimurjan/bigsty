class FeatureTypeService:
    def __init__(self, repo, name_repo, language_repo):
        self._repo = repo
        self._name_repo = name_repo
        self._language_repo = language_repo

    def create(self, data):
        languages = self._language_repo.get_all()
        if [l.id for l in languages] != [n['language_id'] for n in data['names']]:
            raise self.LanguageInvalid()

        feature_type = self._repo.create()
        for name in data['names']:
            self._name_repo.create(
                language_id=name['language_id'],
                value=name['value'],
                feature_type_id=feature_type.id
            )
        return feature_type

    def get_all(self):
        return self._repo.get_all()

    def get_one(self, id_):
        try:
            return self._repo.get_by_id(id_)
        except self._repo.DoesNotExist:
            raise self.FeatureTypeNotFound()

    class FeatureTypeNotFound(Exception):
        pass

    class LanguageInvalid(Exception):
        pass
