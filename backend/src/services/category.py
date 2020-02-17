import json

from elasticsearch.client import Elasticsearch

from src.models.intl import Language
from src.repos.category import CategoryRepo
from src.services.decorators import allow_roles


class CategoryService:
    def __init__(self, repo: CategoryRepo, es: Elasticsearch):
        self._repo = repo
        self._es = es

    def get_all(self):
        return self._repo.get_all()

    def get_one(self, id_):
        try:
            return self._repo.get_by_id(id_)
        except self._repo.DoesNotExist:
            raise self.CategoryNotFound()

    @allow_roles(['admin', 'manager'])
    def create(self, data, *args, **kwargs):
        with self._repo.session() as s:
            return self._repo.add_category(
                data['names'],
                data.get('parent_category_id'),
                session=s
            )

    @allow_roles(['admin', 'manager'])
    def update(self, id_, data, *args, **kwargs):
        try:
            with self._repo.session() as s:
                parent_category_id = data.get('parent_category_id')
                if (parent_category_id != None and parent_category_id == id_):
                    raise self.CircularCategoryConnection()

                return self._repo.update_category(
                    id_,
                    data['names'],
                    parent_category_id,
                    session=s
                )
        except self._repo.DoesNotExist:
            raise self.CategoryNotFound()

    @allow_roles(['admin', 'manager'])
    def delete(self, id_):
        try:
            return self._repo.delete(id_)
        except self._repo.DoesNotExist:
            raise self.CategoryNotFound()

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
        result = self._es.search(index='category', body=body)

        ids = [hit['_id'] for hit in result['hits']['hits']]
        
        return self._repo.filter_by_ids(ids)

    class CategoryNotFound(Exception):
        pass

    class CircularCategoryConnection(Exception):
        pass
