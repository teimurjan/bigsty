class FeatureValuesPolicy:
    def __init__(self, feature_type_repo):
        self._feature_type_repo = feature_type_repo

    def are_allowed_if_category_is(self, feature_values, category):
        feature_types = self._feature_type_repo.get_for_category(category)
        valid_feature_types_ids = {ft.id for ft in feature_types}
        fv_types_allowed = all(
            fv.feature_type.id in valid_feature_types_ids for fv in feature_values
        )
        return fv_types_allowed

    def are_allowed_if_product_type_is(self, feature_values, product_type):
        valid_feature_values_ids = {
            fv.id for fv in product_type.feature_values
        }
        fv_ids_allowed = all(
            feature_value.id in valid_feature_values_ids for feature_value in feature_values
        )

        feature_types_ids = [
            feature_value.feature_type.id for feature_value in feature_values
        ]
        has_ft_duplicates = (
            len(feature_types_ids) != len(set(feature_types_ids))
        )

        return fv_ids_allowed and not has_ft_duplicates
