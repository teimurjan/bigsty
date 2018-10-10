from api.utils.image import base64_to_image, Base64ToImageConversionException


class ProductTypeService:
    def __init__(
        self,
        repo,
        name_repo,
        description_repo,
        short_description_repo,
        category_repo,
        feature_value_repo,
        language_repo,
    ):
        self._repo = repo
        self._name_repo = name_repo
        self._description_repo = description_repo
        self._short_description_repo = short_description_repo
        self._category_repo = category_repo
        self._feature_value_repo = feature_value_repo
        self._language_repo = language_repo

    def create(self, data):
        try:
            image = base64_to_image(data['image'])
            category = self._category_repo.get_by_id(
                data['category_id']
            )

            feature_values = self._feature_value_repo.filter_by(
                id__in=data['feature_values']
            )
            invalid_id_given = (
                len(feature_values) != len(data['feature_values'])
            )
            if invalid_id_given or not self._feature_values_valid(category, feature_values):
                raise self.FeatureValuesInvalid()

            languages_ids = [l.id for l in self._language_repo.get_all()]
            names_languages_valid = languages_ids == [
                n['language_id'] for n in data['names']
            ]
            s_descriptions_languages_valid = languages_ids == [
                s['language_id'] for s in data['short_descriptions']
            ]
            descriptions_languages_valid = languages_ids == [
                d['language_id'] for d in data['descriptions']
            ]
            if not (names_languages_valid and s_descriptions_languages_valid and descriptions_languages_valid):
                raise self.LanguageInvalid()

            product_type = self._repo.create(
                category_id=category.id,
                image=image,
            )

            for fv in feature_values:
                self._feature_value_repo.associate_with_product_type(
                    product_type, fv
                )
            for name in data['names']:
                self._name_repo.create(
                    language_id=name['language_id'],
                    value=name['value'],
                    product_type_id=product_type.id
                )
            return product_type
        except self._category_repo.DoesNotExist:
            raise self.CategoryInvalid()
        except Base64ToImageConversionException:
            raise self.ProductImageInvalid()

    def _feature_values_valid(self, category, feature_values):
        valid_feature_types_ids = {
            ft.id for ft in category.feature_types}
        return all(
            fv.feature_type.id in valid_feature_types_ids for fv in feature_values
        )

    def get_all(self):
        return self._repo.get_all()

    class CategoryInvalid(Exception):
        pass

    class FeatureValuesInvalid(Exception):
        pass

    class FeatureValuesOfTheSameType(Exception):
        pass

    class ProductTypeInvalid(Exception):
        pass

    class ProductImageInvalid(Exception):
        pass

    class LanguageInvalid(Exception):
        pass
