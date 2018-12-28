from api.utils.image import validate_image
from api.services.decorators import allow_roles


class ProductService:
    def __init__(
        self,
        repo,
        product_image_repo,
        product_type_repo,
        feature_value_repo,
        feature_values_policy
    ):
        self._repo = repo
        self._product_image_repo = product_image_repo
        self._product_type_repo = product_type_repo
        self._feature_value_repo = feature_value_repo
        self._feature_values_policy = feature_values_policy

    #@allow_roles(['admin', 'manager'])
    def create(self, data, *args, **kwargs):
        try:
            product_type = self._product_type_repo.get_by_id(
                data['product_type_id']
            )
            feature_values = self._feature_value_repo.get_by_ids(
                data['feature_values'],
                raise_err_on_invalid_id=True
            )

            if not self._feature_values_policy.are_allowed_if_product_type_is(
                feature_values,
                product_type
            ):
                raise self.FeatureValuesInvalid()

            for image in data['images']:
                validate_image(image)

            product = self._repo.create(
                product_type=product_type,
                price=data['price'],
                discount=data['discount'],
                quantity=data['quantity'],
            )

            self._repo.set_feature_values(product, feature_values)

            for image in data['images']:
                self._product_image_repo.create(
                    product=product,
                    image=image
                )

            return product
        except self._feature_value_repo.DoesNotExist:
            raise self.FeatureValuesInvalid()
        except self._product_type_repo.DoesNotExist:
            raise self.ProductTypeInvalid()
        except IOError:
            raise self.ProductImageInvalid()

    #@allow_roles(['admin', 'manager'])
    def update(self, product_id, data, *args, **kwargs):
        try:
            product = self.get_one(product_id)

            product_type = self._product_type_repo.get_by_id(
                data['product_type_id']
            )
            feature_values = self._feature_value_repo.get_by_ids(
                data['feature_values'],
                raise_err_on_invalid_id=True
            )

            if not self._feature_values_policy.are_allowed_if_product_type_is(
                feature_values,
                product_type
            ):
                raise self.FeatureValuesInvalid()

            for image in data['images']:
                validate_image(image)

            self._repo.update(
                product,
                product_type=product_type,
                price=data['price'],
                discount=data['discount'],
                quantity=data['quantity'],
            )

            self._repo.set_feature_values(product, feature_values)

            self._product_image_repo.delete_all_for_product(product)
            for image in data['images']:
                self._product_image_repo.create(
                    product=product,
                    image=image
                )

            return product
        except self._feature_value_repo.DoesNotExist:
            raise self.FeatureValuesInvalid()
        except self._product_type_repo.DoesNotExist:
            raise self.ProductTypeInvalid()
        except IOError:
            raise self.ProductImageInvalid()

    def get_all(self):
        return self._repo.get_all()

    def get_one(self, id_):
        try:
            return self._repo.get_by_id(id_)
        except self._repo.DoesNotExist:
            raise self.ProductNotFound()

    #@allow_roles(['admin', 'manager'])
    def delete(self, id_):
        try:
            return self._repo.delete(id_)
        except self._repo.DoesNotExist:
            raise self.ProductNotFound()

    class ProductNotFound(Exception):
        pass

    class FeatureValuesInvalid(Exception):
        pass

    class ProductTypeInvalid(Exception):
        pass

    class ProductImageInvalid(Exception):
        pass
