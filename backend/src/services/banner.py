import json

from elasticsearch.client import Elasticsearch

from src.models.intl import Language
from src.repos.banner import BannerRepo
from src.services.decorators import allow_roles


class BannerService:
    def __init__(self, repo: BannerRepo):
        self._repo = repo

    def get_all(self):
        return self._repo.get_all()

    def get_one(self, id_):
        try:
            return self._repo.get_by_id(id_)
        except self._repo.DoesNotExist:
            raise self.BannerNotFound()

    @allow_roles(['admin', 'manager'])
    def create(self, data, *args, **kwargs):
        return self._repo.add_banner(
            data['texts'],
            data.get('link'),
            data.get('image'),
        )

    @allow_roles(['admin', 'manager'])
    def update(self, id_, data, *args, **kwargs):
        try:
            category = self._repo.update_banner(
                id_,
                data['texts'],
                data.get('link'),
                data.get('image'),
            )

            return category
        except self._repo.DoesNotExist:
            raise self.BannerNotFound()

    @allow_roles(['admin', 'manager'])
    def delete(self, id_):
        try:
            self._repo.delete(id_)
        except self._repo.DoesNotExist:
            raise self.BannerNotFound()

    class BannerNotFound(Exception):
        pass
