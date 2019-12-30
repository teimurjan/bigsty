from src.services.decorators import allow_roles
from src.repos.category import CategoryRepo
from src.repos.feature_type import FeatureTypeRepo
from src.repos.product_type import ProductTypeRepo


class ProductTypeService:
    def __init__(
        self,
        repo: ProductTypeRepo,
        category_repo: CategoryRepo,
        feature_type_repo: FeatureTypeRepo,
    ):
        self._repo = repo
        self._category_repo = category_repo
        self._feature_type_repo = feature_type_repo

    @allow_roles(['admin', 'manager'])
    def create(self, data, *args, **kwargs):
        try:
            with self._repo.session() as s:
                category = self._category_repo.get_by_id(
                    data['category_id'],
                    session=s
                )

                feature_types = self._feature_type_repo.filter_by_ids(
                    data['feature_types'],
                    session=s
                )

                if len(feature_types) != len(data['feature_types']):
                    raise self.FeatureTypesInvalid()

                return self._repo.add_product_type(
                    data['names'],
                    data['descriptions'],
                    data['short_descriptions'],
                    data['image'],
                    category,
                    feature_types,
                    session=s
                )
        except self._category_repo.DoesNotExist:
            raise self.CategoryInvalid()
        except self._feature_type_repo.DoesNotExist:
            raise self.FeatureTypesInvalid()

    @allow_roles(['admin', 'manager'])
    def update(self, id_, data, *args, **kwargs):
        try:
            with self._repo.session() as s:
                category = self._category_repo.get_by_id(
                    data['category_id'],
                    session=s
                )

                feature_types = self._feature_type_repo.filter_by_ids(
                    data['feature_types'],
                    session=s
                )

                if len(feature_types) != len(data['feature_types']):
                    raise self.FeatureTypesInvalid()

                return self._repo.update_product_type(
                    id_,
                    data['names'],
                    data['descriptions'],
                    data['short_descriptions'],
                    data['image'],
                    category,
                    feature_types,
                    session=s
                )
        except self._repo.DoesNotExist:
            raise self.ProductTypeNotFound()
        except self._category_repo.DoesNotExist:
            raise self.CategoryInvalid()
        except self._feature_type_repo.DoesNotExist:
            raise self.FeatureTypesInvalid()

    def get_all(self):
        return self._repo.get_all()

    def get_by_category_id(self, category_id):
        return self._repo.filter_by_category_id(category_id)

    def get_one(self, id_):
        try:
            return self._repo.get_by_id(id_)
        except self._repo.DoesNotExist:
            raise self.ProductTypeNotFound()

    @allow_roles(['admin', 'manager'])
    def delete(self, id_):
        try:
            return self._repo.delete(id_)
        except self._repo.DoesNotExist:
            raise self.ProductTypeNotFound()

    class ProductTypeNotFound(Exception):
        pass

    class CategoryInvalid(Exception):
        pass

    class FeatureTypesInvalid(Exception):
        pass

