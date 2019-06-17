from src.services.decorators import allow_roles
from src.repos.category import CategoryRepo
from src.repos.feature_value import FeatureValueRepo
from src.repos.product_type import ProductTypeRepo
from src.policies.feature_values import FeatureValuesPolicy


class ProductTypeService:
    def __init__(
        self,
        repo: ProductTypeRepo,
        category_repo: CategoryRepo,
        feature_value_repo: FeatureValueRepo,
        feature_values_policy: FeatureValuesPolicy,
    ):
        self._repo = repo
        self._category_repo = category_repo
        self._feature_value_repo = feature_value_repo
        self._feature_values_policy = feature_values_policy

    @allow_roles(['admin', 'manager'])
    def create(self, data, *args, **kwargs):
        try:
            with self._repo.session() as s:
                category = self._category_repo.get_by_id(
                    data['category_id'],
                    session=s
                )

                feature_values = self._feature_value_repo.filter_by_ids(
                    data['feature_values'],
                    session=s
                )

                if len(feature_values) != len(data['feature_values']):
                    raise self.FeatureValuesInvalid()

                if not self._feature_values_policy.are_allowed_if_category_is(
                    feature_values,
                    category
                ):
                    raise self.FeatureValuesOfInvalidType()

                return self._repo.add_product_type(
                    data['names'],
                    data['descriptions'],
                    data['short_descriptions'],
                    data['image'],
                    category,
                    feature_values,
                    session=s
                )
        except self._category_repo.DoesNotExist:
            raise self.CategoryInvalid()
        except self._feature_value_repo.DoesNotExist:
            raise self.FeatureValuesInvalid()

    @allow_roles(['admin', 'manager'])
    def update(self, id_, data, *args, **kwargs):
        try:
            with self._repo.session() as s:
                category = self._category_repo.get_by_id(
                    data['category_id'],
                    session=s
                )

                feature_values = self._feature_value_repo.filter_by_ids(
                    data['feature_values'],
                    session=s
                )

                print(f"\n\n\nopopo\n\n\n")

                if len(feature_values) != len(data['feature_values']):
                    raise self.FeatureValuesInvalid()

                if not self._feature_values_policy.are_allowed_if_category_is(
                    feature_values,
                    category
                ):
                    raise self.FeatureValuesOfInvalidType()

                return self._repo.update_product_type(
                    id_,
                    data['names'],
                    data['descriptions'],
                    data['short_descriptions'],
                    data['image'],
                    category,
                    feature_values,
                    session=s
                )

            return product_type
        except self._repo.DoesNotExist:
            raise self.ProductTypeNotFound()
        except self._category_repo.DoesNotExist:
            raise self.CategoryInvalid()
        except self._feature_value_repo.DoesNotExist:
            raise self.FeatureValuesInvalid()

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

    class FeatureValuesInvalid(Exception):
        pass

    class FeatureValuesOfInvalidType(Exception):
        pass
