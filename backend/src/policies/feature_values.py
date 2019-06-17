from src.repos.feature_type import FeatureTypeRepo


class FeatureValuesPolicy:
    def __init__(self, feature_type_repo: FeatureTypeRepo):
        self._feature_type_repo = feature_type_repo

    def are_allowed_if_category_is(self, feature_values, category):
        category_feature_types = (
            self
            ._feature_type_repo
            .filter_by_category(category)
        )
        category_feature_types_ids = {ft.id for ft in category_feature_types}

        return all(
            feature_value.feature_type.id in category_feature_types_ids
            for feature_value in feature_values
        )

    def are_allowed_if_product_type_is(self, feature_values, product_type):
        product_type_feature_values_ids = {
            feature_value.id
            for feature_value in product_type.feature_values
        }
        print("\n\n\n\n")
        print(product_type_feature_values_ids)
        print("\n\n\n\n")
        print("\n\n\n\n")
        print([i.id for i in feature_values])
        print("\n\n\n\n")
        all_feature_values_of_product_type = all(
            feature_value.id in product_type_feature_values_ids
            for feature_value in feature_values
        )

        feature_types_ids = [
            feature_value.feature_type.id for feature_value in feature_values
        ]
        has_no_same_type_feature_value = (
            len(feature_types_ids) != len(set(feature_types_ids))
        )

        return (
            all_feature_values_of_product_type and
            not has_no_same_type_feature_value
        )
