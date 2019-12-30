from src.repos.category import CategoryRepo
from src.services.category import CategoryService


class CategoryServiceFactory:
    @staticmethod
    def create(db_conn):
        repo = CategoryRepo(db_conn)
        return CategoryService(repo=repo)
