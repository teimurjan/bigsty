from src.services.decorators import allow_roles
from src.repos.category import CategoryRepo
from src.repos.feature_type import FeatureTypeRepo


class CategoryService:
    def __init__(self, repo: CategoryRepo, feature_type_repo: FeatureTypeRepo):
        self._repo = repo
        self._feature_type_repo = feature_type_repo

    def get_all(self):
        return self._repo.get_all()

    def get_one(self, id_):
        try:
            return self._repo.get_by_id(id_)
        except self._repo.DoesNotExist:
            raise self.CategoryNotFound()

    @allow_roles(['admin', 'manager'])
    def create(self, data, *args, **kwargs):
        with self._repo.session() as s:
            feature_types = self._feature_type_repo.filter_by_ids(
                data['feature_types'],
                session=s
            )

            if len(feature_types) != len(data['feature_types']):
                raise self.FeatureTypeInvalid()

            return self._repo.add_category(
                data['names'],
                data.get('parent_category_id'),
                feature_types,
                session=s
            )

    # @allow_roles(['admin', 'manager'])
    def update(self, id_, data, *args, **kwargs):
        try:
            with self._repo.session() as s:
                parent_category_id = data.get('parent_category_id')
                if (parent_category_id != None and parent_category_id == id_):
                    raise self.CircularCategoryConnection()
                    

                feature_types = self._feature_type_repo.filter_by_ids(
                    data['feature_types'],
                    session=s
                )

                if len(feature_types) != len(data['feature_types']):
                    raise self.FeatureTypeInvalid()

                return self._repo.update_category(
                    id_,
                    data['names'],
                    parent_category_id,
                    feature_types,
                    session=s
                )
        except self._repo.DoesNotExist:
            raise self.CategoryNotFound()

    @allow_roles(['admin', 'manager'])
    def delete(self, id_):
        try:
            return self._repo.delete(id_)
        except self._repo.DoesNotExist:
            raise self.CategoryNotFound()

    class CategoryNotFound(Exception):
        pass

    class FeatureTypeInvalid(Exception):
        pass

    class CircularCategoryConnection(Exception):
        pass
