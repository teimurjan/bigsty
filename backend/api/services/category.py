from api.services.decorators import allow_roles


class CategoryService:
    def __init__(self, repo, name_repo, language_repo):
        self._repo = repo
        self._name_repo = name_repo
        self._language_repo = language_repo

    def get_all(self):
        return tuple(self._repo.get_all())

    def get_one(self, id_):
        try:
            return self._repo.get_by_id(id_)
        except self._repo.DoesNotExist:
            raise self.CategoryNotFound()

    @allow_roles(['admin', 'manager'])
    def create(self, data, *args, **kwargs):
        languages = self._language_repo.get_all()
        not_all_languages_given = [l.id for l in languages] != [
            n['language_id'] for n in data['names']]
        if not_all_languages_given:
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

    # @allow_roles(['admin', 'manager', 'reader'])
    def update(self, category_id, data, *args, **kwargs):
        languages = self._language_repo.get_all()
        not_all_languages_given = [l.id for l in languages] != [
            n['language_id'] for n in data['names']]
        if not_all_languages_given:
            raise self.LanguageInvalid()

        category = self.get_one(category_id)

        for name in category.names:
            new_name = next(filter(lambda n: n['language_id'] == name.language.id, data['names']))
            self._name_repo.update(
                name.id,
                value=new_name['value']
            )
            name.value = new_name['value']

        return category

    class LanguageInvalid(Exception):
        pass

    class CategoryNotFound(Exception):
        pass
