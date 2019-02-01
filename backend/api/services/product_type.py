from api.utils.image import validate_image
from api.services.decorators import allow_roles


class ProductTypeService:
    def __init__(
        self,
        repo,
        name_repo,
        description_repo,
        short_description_repo,
        category_repo,
        feature_value_repo,
        intl_texts_policy,
        feature_values_policy,
    ):
        self._repo = repo
        self._name_repo = name_repo
        self._description_repo = description_repo
        self._short_description_repo = short_description_repo
        self._category_repo = category_repo
        self._feature_value_repo = feature_value_repo
        self._intl_texts_policy = intl_texts_policy
        self._feature_values_policy = feature_values_policy

    @allow_roles(['admin', 'manager'])
    def create(self, data, *args, **kwargs):
        try:
            validate_image(data['image'])

            category = self._category_repo.get_by_id(data['category_id'])

            feature_values = self._feature_value_repo.get_by_ids(
                data['feature_values'],
                raise_err_on_invalid_id=True
            )

            if not self._feature_values_policy.are_allowed_if_category_is(
                feature_values,
                category
            ):
                raise self.FeatureValuesOfInvalidType()

            if not (
                self._intl_texts_policy.are_valid(data['names']) and
                self._intl_texts_policy.are_valid(data['descriptions']) and
                self._intl_texts_policy.are_valid(
                    data['short_descriptions']
                )
            ):
                raise self.LanguageInvalid()

            product_type = self._repo.create(
                category=category,
                image=data['image']
            )

            self._repo.set_feature_values(product_type, feature_values)

            for language_id, name in data['names'].items():
                description = data['descriptions'][language_id]
                short_description = data['short_descriptions'][language_id]
                self._name_repo.create(
                    language_id=language_id,
                    value=name,
                    product_type=product_type
                )
                self._description_repo.create(
                    language_id=language_id,
                    value=description,
                    product_type=product_type
                )
                self._short_description_repo.create(
                    language_id=language_id,
                    value=short_description,
                    product_type=product_type
                )

            return product_type
        except self._category_repo.DoesNotExist:
            raise self.CategoryInvalid()
        except self._feature_value_repo.DoesNotExist:
            raise self.FeatureValuesInvalid()
        except IOError:
            raise self.ProductTypeImageInvalid()

    @allow_roles(['admin', 'manager'])
    def update(self, product_type_id, data, *args, **kwargs):
        try:
            product_type = self.get_one(product_type_id)

            validate_image(data['image'])

            category = self._category_repo.get_by_id(data['category_id'])

            feature_values = self._feature_value_repo.get_by_ids(
                data['feature_values'],
                raise_err_on_invalid_id=True
            )

            if not self._feature_values_policy.are_allowed_if_category_is(
                feature_values,
                category
            ):
                raise self.FeatureValuesOfInvalidType()

            if not (
                self._intl_texts_policy.are_valid(data['names']) and
                self._intl_texts_policy.are_valid(data['descriptions']) and
                self._intl_texts_policy.are_valid(
                    data['short_descriptions']
                )
            ):
                raise self.LanguageInvalid()

            self._repo.update(
                product_type,
                category=category,
                image=data['image']
            )

            self._repo.set_feature_values(product_type, feature_values)

            for name, description, short_description in zip(product_type.names, product_type.descriptions, product_type.short_descriptions):
                new_name = data['names'][str(name.language.id)]
                if name.value != new_name:
                    self._name_repo.update(name, new_name)

                new_description = data['descriptions'][str(name.language.id)]
                if description.value != new_description:
                    self._description_repo.update(name, new_description)

                new_short_description = data['short_descriptions'][str(
                    name.language.id)]
                if short_description.value != new_short_description:
                    self._short_description_repo.update(
                        name, new_short_description
                    )

            return product_type
        except self._feature_value_repo.DoesNotExist:
            raise self.FeatureValuesInvalid()

    def get_all(self):
        return tuple(self._repo.get_all())

    def get_by_category_id(self, category_id):
        return tuple(self._repo.get_by_category_id(category_id))

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

    class ProductTypeImageInvalid(Exception):
        pass

    class LanguageInvalid(Exception):
        pass
