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
        feature_type_repo,
        feature_value_repo,
        language_repo,
    ):
        self._repo = repo
        self._name_repo = name_repo
        self._description_repo = description_repo
        self._short_description_repo = short_description_repo
        self._category_repo = category_repo
        self._feature_type_repo = feature_type_repo
        self._feature_value_repo = feature_value_repo
        self._language_repo = language_repo

    @allow_roles(['admin', 'manager'])
    def create(self, data, *args, **kwargs):
        try:
            category = self._category_repo.get_by_id(data['category_id'])
            feature_values = tuple(self._feature_value_repo.filter_by(
                id__in=data['feature_values']
            ))

            invalid_feature_value_given = (
                len(feature_values) != len(data['feature_values'])
            )
            if invalid_feature_value_given:
                raise self.FeatureValuesInvalid()

            if not self._are_feature_values_allowed(category, feature_values):
                raise self.FeatureValuesOfInvalidType()

            if not self._are_intl_fields_valid(
                data['names'],
                data['descriptions'],
                data['short_descriptions']
            ):
                raise self.LanguageInvalid()

            validate_image(data['image'])
            product_type = self._repo.create(
                category_id=category.id,
                image=data['image'],
            )

            for fv in feature_values:
                self._feature_value_repo.add_to_product_type(
                    product_type, fv
                )

            self._add_intl_fields(
                product_type,
                data['names'],
                data['descriptions'],
                data['short_descriptions'],
            )

            return product_type
        except self._category_repo.DoesNotExist:
            raise self.CategoryInvalid()
        except IOError:
            raise self.ProductImageInvalid()

    def _are_feature_values_allowed(self, category, feature_values):
        category_feature_types = self._feature_type_repo.get_for_category(
            category
        )
        valid_feature_types_ids = {ft.id for ft in category_feature_types}
        return all(
            fv.feature_type.id in valid_feature_types_ids for fv in feature_values
        )

    def _are_intl_fields_valid(self, names, descriptions, short_descriptions):
        languages_ids = [l.id for l in self._language_repo.get_all()]
        return (
            languages_ids == [
                n['language_id'] for n in names
            ] and languages_ids == [
                s['language_id'] for s in short_descriptions
            ] and languages_ids == [
                d['language_id'] for d in descriptions
            ]
        )

    def _add_intl_fields(self, product_type, names, descriptions, short_descriptions):
        for i, name in enumerate(names):
            description = descriptions[i]
            short_description = short_descriptions[i]
            product_type.names.append(
                self._name_repo.create(
                    language_id=name['language_id'],
                    value=name['value'],
                    product_type_id=product_type.id
                )
            )
            product_type.descriptions.append(
                self._description_repo.create(
                    language_id=description['language_id'],
                    value=description['value'],
                    product_type_id=product_type.id
                )
            )
            product_type.short_descriptions.append(
                self._short_description_repo.create(
                    language_id=short_description['language_id'],
                    value=short_description['value'],
                    product_type_id=product_type.id
                )
            )

    def get_all(self):
        return self._repo.get_all()

    class CategoryInvalid(Exception):
        pass

    class FeatureValuesInvalid(Exception):
        pass

    class FeatureValuesOfInvalidType(Exception):
        pass

    class ProductImageInvalid(Exception):
        pass

    class LanguageInvalid(Exception):
        pass
