from api.utils.image import validate_image
from api.services.decorators import allow_roles

class ProductService:
    def __init__(
        self,
        repo,
        product_image_repo,
        product_type_repo,
        feature_value_repo,
    ):
        self._repo = repo
        self._product_image_repo = product_image_repo
        self._product_type_repo = product_type_repo
        self._feature_value_repo = feature_value_repo

    @allow_roles(['admin', 'manager'])
    def create(self, data, *args, **kwargs):
        try:
            product_type = self._product_type_repo.get_by_id(
                data['product_type_id']
            )
            feature_values = tuple(self._feature_value_repo.filter_by(
                id__in=data['feature_values']
            ))
            invalid_id_given = (
                len(feature_values) != len(data['feature_values'])
            )
            if invalid_id_given or not self._feature_values_valid(product_type, feature_values):
                raise self.FeatureValuesInvalid()
            if self._the_same_type_feature_values(feature_values):
                raise self.FeatureValuesOfTheSameType()

            for image in data['images']:
                validate_image(image)

            product = self._repo.create(
                product_type_id=product_type.id,
                price=data['price'],
                discount=data['discount'],
                quantity=data['quantity'],
            )

            for fv in feature_values:
                self._feature_value_repo.add_to_product(product, fv)

            for image in data['images']:
                self._product_image_repo.create(
                    product_id=product.id,
                    image=image
                )

            return product
        except self._product_type_repo.DoesNotExist:
            raise self.ProductTypeInvalid()
        except IOError:
            raise self.ProductImageInvalid()

    def _feature_values_valid(self, product_type, feature_values):
        valid_feature_values_ids = {
            fv.id for fv in product_type.feature_values
        }
        return all(
            feature_value.id in valid_feature_values_ids for feature_value in feature_values
        )

    def _the_same_type_feature_values(self, feature_values):
        feature_types_ids = [
            feature_value.feature_type.id for feature_value in feature_values
        ]
        return len(feature_types_ids) != len(set(feature_types_ids))

    def get_all(self):
        return self._repo.get_all()

    class FeatureValuesInvalid(Exception):
        pass

    class FeatureValuesOfTheSameType(Exception):
        pass

    class ProductTypeInvalid(Exception):
        pass

    class ProductImageInvalid(Exception):
        pass
