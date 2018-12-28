from api.models import CategoryName
from api.repos.base import Repo


class CategoryNameRepo(Repo):
    def __init__(self):
        super().__init__(CategoryName)

    def create(self, language_id, value, category):
        name = super()._create(
            language_id=language_id,
            value=value,
            category_id=category.id
        )
        category.names.append(name)

    def update(self, name, value):
        self.model_cls.objects.filter(
            language_id=name.language.id,
            category_id=name.category.id
        ).update(value=value)
        name.value = value
