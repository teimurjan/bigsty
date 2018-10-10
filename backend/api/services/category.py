class CategoryService:
    def __init__(self, repo, name_repo, language_repo):
        self._repo = repo
        self._name_repo = name_repo
        self._language_repo = language_repo

    def get_all(self):
        return self._repo.get_all()

    def create(self, data):
        languages = self._language_repo.get_all()
        if [l.id for l in languages] != [n['language_id'] for n in data['names']]:
            raise self.LanguageInvalid()

        category = self._repo.create()
        for name in data['names']:
            category.names.append(
                self._name_repo.create(
                    language_id=name['language_id'],
                    value=name['value'],
                    category_id=category.id
                )
            )

        return category

    class LanguageInvalid(Exception):
        pass
