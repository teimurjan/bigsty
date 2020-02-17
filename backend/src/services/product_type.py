import json

from elasticsearch.client import Elasticsearch

from src.models.intl import Language
from src.repos.category import CategoryRepo
from src.repos.feature_type import FeatureTypeRepo
from src.repos.product_type import ProductTypeRepo
from src.services.decorators import allow_roles


class ProductTypeService:
    def __init__(
        self,
        repo: ProductTypeRepo,
        category_repo: CategoryRepo,
        feature_type_repo: FeatureTypeRepo,
        es: Elasticsearch
    ):
        self._repo = repo
        self._category_repo = category_repo
        self._feature_type_repo = feature_type_repo
        self._es = es

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

    def get_all_categorized(self, category_id):
        with self._repo.session() as s:
            children_categories = self._category_repo.get_children(category_id, session=s)
            categories_ids = [category.id for category in children_categories]
            product_types = self._repo.get_for_categories_with_products([category_id, *categories_ids], session=s)
            return product_types

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

    def search(self, query: str, language: Language):
        formatted_query = query.lower()
        body = json.loads('''
            {
                "query": {
                    "bool": {
                        "should": [
                            {
                                "prefix": {
                                    "%s": "%s"
                                }
                            },
                            {
                                "match": {
                                    "%s": {
                                        "query": "%s",
                                        "fuzziness": "AUTO",
                                        "operator": "and"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        ''' % (language.name, formatted_query, language.name, formatted_query)
        )
        result = self._es.search(index='product_type', body=body)

        ids = [hit['_id'] for hit in result['hits']['hits']]

        return self._repo.filter_by_ids(ids)

    class ProductTypeNotFound(Exception):
        pass

    class CategoryInvalid(Exception):
        pass

    class FeatureTypesInvalid(Exception):
        pass
