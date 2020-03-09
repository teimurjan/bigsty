
import logging
import os

import sqlalchemy as db
from cerberus.validator import Validator
from elasticsearch import Elasticsearch
from flask import Flask, send_from_directory
from flask_cors import CORS

from paths import APP_ROOT_PATH
from src.abstract_view import AbstractView
from src.middleware.http.authorize import AuthorizeHttpMiddleware
from src.middleware.http.language import LanguageHttpMiddleware
from src.repos.banner import BannerRepo
from src.repos.category import CategoryRepo
from src.repos.feature_type import FeatureTypeRepo
from src.repos.feature_value import FeatureValueRepo
from src.repos.language import LanguageRepo
from src.repos.product import ProductRepo
from src.repos.product_type import ProductTypeRepo
from src.repos.user import UserRepo
from src.serializers.banner import BannerSerializer
from src.serializers.category import CategorySerializer
from src.serializers.feature_type import FeatureTypeSerializer
from src.serializers.feature_value import FeatureValueSerializer
from src.serializers.language import LanguageSerializer
from src.serializers.product import ProductSerializer
from src.serializers.product_type import ProductTypeSerializer
from src.services.banner import BannerService
from src.services.category import CategoryService
from src.services.feature_type import FeatureTypeService
from src.services.feature_value import FeatureValueService
from src.services.language import LanguageService
from src.services.product import FeatureValuesPolicy, ProductService
from src.services.product_type import ProductTypeService
from src.services.user import UserService
from src.storage.aws_storage import AWSStorage
from src.validation_rules.authentication import AUTHENTICATION_VALIDATION_RULES
from src.validation_rules.banner.create import CREATE_BANNER_VALIDATION_RULES
from src.validation_rules.banner.update import UPDATE_BANNER_VALIDATION_RULES
from src.validation_rules.category.create import \
    CREATE_CATEGORY_VALIDATION_RULES
from src.validation_rules.category.update import \
    UPDATE_CATEGORY_VALIDATION_RULES
from src.validation_rules.feature_type.create import \
    CREATE_FEATURE_TYPE_VALIDATION_RULES
from src.validation_rules.feature_type.update import \
    UPDATE_FEATURE_TYPE_VALIDATION_RULES
from src.validation_rules.feature_value.create import \
    CREATE_FEATURE_VALUE_VALIDATION_RULES
from src.validation_rules.feature_value.update import \
    UPDATE_FEATURE_VALUE_VALIDATION_RULES
from src.validation_rules.product.create import CREATE_PRODUCT_VALIDATION_RULES
from src.validation_rules.product.update import UPDATE_PRODUCT_VALIDATION_RULES
from src.validation_rules.product_type.create import \
    CREATE_PRODUCT_TYPE_VALIDATION_RULES
from src.validation_rules.product_type.update import \
    UPDATE_PRODUCT_TYPE_VALIDATION_RULES
from src.validation_rules.refresh_token import REFRESH_TOKEN_VALIDATION_RULES
from src.validation_rules.registration import REGISTRATION_VALIDATION_RULES
from src.views.authentication import AuthenticationView
from src.views.banner.detail import BannerDetailView
from src.views.banner.list import BannerListView
from src.views.category.detail import CategoryDetailView
from src.views.category.list import CategoryListView
from src.views.feature_type.detail import FeatureTypeDetailView
from src.views.feature_type.list import FeatureTypeListView
from src.views.feature_value.detail import FeatureValueDetailView
from src.views.feature_value.list import FeatureValueListView
from src.views.language.list import LanguageListView
from src.views.product.by_product_type import ProductByProductTypeView
from src.views.product.detail import ProductDetailView
from src.views.product.for_cart import ProductForCartView
from src.views.product.list import ProductListView
from src.views.product_type.by_category import ProductTypeByCategoryView
from src.views.product_type.detail import ProductTypeDetailView
from src.views.product_type.list import ProductTypeListView
from src.views.product_type.newest import ProductTypeNewestView
from src.views.refresh_token import RefreshTokenView
from src.views.registration import RegistrationView
from src.views.search import SearchView


class App:
    def __init__(self):
        self.flask_app = Flask(__name__)
        self.flask_app.config.from_object(os.environ.get(
            'APP_SETTINGS', 'config.DevelopmentConfig'))
        CORS(self.flask_app, origins=self.flask_app.config['ALLOWED_ORIGINS'])
        self.__file_storage = AWSStorage(
            self.flask_app.config['AWS_BUCKET_NAME'],
            self.flask_app.config['AWS_DEFAULT_REGION'],
            self.flask_app.config['AWS_ACCESS_KEY_ID'],
            self.flask_app.config['AWS_SECRET_ACCESS_KEY']
        )
        engine = db.create_engine(self.flask_app.config['DB_URL'], echo=True)
        self.__db_conn = engine.connect()
        self.__es = Elasticsearch(self.flask_app.config['ELASTICSEARCH_URL'])

        self.__init_repos()
        self.__init_services()
        self.__init_search()
        self.__init_api_routes()
        self.__init_media_route()

    def __init_repos(self):
        self.__category_repo = CategoryRepo(self.__db_conn)
        self.__feature_type_repo = FeatureTypeRepo(self.__db_conn)
        self.__feature_value_repo = FeatureValueRepo(self.__db_conn)
        self.__language_repo = LanguageRepo(self.__db_conn)
        self.__product_type_repo = ProductTypeRepo(
            self.__db_conn, self.__file_storage)
        self.__product_repo = ProductRepo(self.__db_conn, self.__file_storage)
        self.__user_repo = UserRepo(self.__db_conn)
        self.__banner_repo = BannerRepo(self.__db_conn, self.__file_storage)

    def __init_services(self):
        self.__category_service = CategoryService(
            self.__category_repo, self.__product_type_repo, self.__es)
        self.__feature_type_service = FeatureTypeService(
            self.__feature_type_repo)
        self.__feature_value_service = FeatureValueService(
            self.__feature_value_repo, self.__feature_type_repo
        )
        self.__language_service = LanguageService(self.__language_repo)
        self.__product_type_service = ProductTypeService(
            self.__product_type_repo, self.__category_repo, self.__feature_type_repo, self.__product_repo, self.__es
        )
        feature_values_policy = FeatureValuesPolicy(self.__feature_type_repo)
        self.__product_service = ProductService(
            self.__product_repo, self.__product_type_repo, self.__feature_value_repo, feature_values_policy
        )
        self.__user_service = UserService(self.__user_repo)
        self.__banner_service = BannerService(self.__banner_repo)

    def __init_search(self):
        if not self.__es.indices.exists(index="category"):
            self.__es.indices.create(index='category')
        if not self.__es.indices.exists(index="product_type"):
            self.__es.indices.create(index='product_type')

        for category in self.__category_repo.get_all():
            self.__category_service.set_to_search_index(category)

        for product_type in self.__product_type_repo.get_all():
            self.__product_type_service.set_to_search_index(product_type)

    def __init_api_routes(self):
        middlewares = [
            AuthorizeHttpMiddleware(self.__user_service),
            LanguageHttpMiddleware(self.__language_repo)
        ]

        self.flask_app.add_url_rule(
            '/api/auth/login',
            view_func=AbstractView.as_view(
                'login',
                concrete_view=AuthenticationView(
                    self.__user_service, Validator(
                        AUTHENTICATION_VALIDATION_RULES)
                ),
                middlewares=middlewares
            ),
            methods=['POST']
        )
        self.flask_app.add_url_rule(
            '/api/auth/register',
            view_func=AbstractView.as_view(
                'register',
                concrete_view=RegistrationView(
                    self.__user_service, Validator(
                        REGISTRATION_VALIDATION_RULES)
                ),
                middlewares=middlewares
            ),
            methods=['POST']
        )
        self.flask_app.add_url_rule(
            '/api/auth/refresh',
            view_func=AbstractView.as_view(
                'refresh_token',
                concrete_view=RefreshTokenView(
                    self.__user_service, Validator(
                        REFRESH_TOKEN_VALIDATION_RULES)
                ),
                middlewares=middlewares
            ),
            methods=['POST']

        )
        self.flask_app.add_url_rule(
            '/api/categories',
            view_func=AbstractView.as_view(
                'categories',
                concrete_view=CategoryListView(
                    Validator(
                        CREATE_CATEGORY_VALIDATION_RULES), self.__category_service, CategorySerializer
                ),
                middlewares=middlewares
            ),
            methods=['GET', 'POST']
        )
        self.flask_app.add_url_rule(
            '/api/categories/<int:category_id>',
            view_func=AbstractView.as_view(
                'category',
                concrete_view=CategoryDetailView(
                    Validator(
                        UPDATE_CATEGORY_VALIDATION_RULES), self.__category_service, CategorySerializer
                ),
                middlewares=middlewares
            ),
            methods=['GET', 'PUT', 'DELETE']
        )
        self.flask_app.add_url_rule(
            '/api/categories/<int:category_id>/product_types',
            view_func=AbstractView.as_view(
                'category_product_types',
                concrete_view=ProductTypeByCategoryView(
                    self.__product_type_service, ProductTypeSerializer),
                middlewares=middlewares
            ),
            methods=['GET']
        )
        self.flask_app.add_url_rule(
            '/api/search/<path:query>',
            view_func=AbstractView.as_view(
                'search',
                concrete_view=SearchView(
                    self.__category_service, self.__product_type_service, CategorySerializer, ProductTypeSerializer),
                middlewares=middlewares
            ),
            methods=['GET']
        )
        self.flask_app.add_url_rule(
            '/api/feature_types',
            view_func=AbstractView.as_view(
                'feature_types',
                concrete_view=FeatureTypeListView(Validator(
                    CREATE_FEATURE_TYPE_VALIDATION_RULES), self.__feature_type_service, FeatureTypeSerializer),
                middlewares=middlewares
            ),
            methods=['GET', 'POST']
        ),
        self.flask_app.add_url_rule(
            '/api/feature_types/<int:feature_type_id>',
            view_func=AbstractView.as_view(
                'feature_type',
                concrete_view=FeatureTypeDetailView(Validator(
                    UPDATE_FEATURE_TYPE_VALIDATION_RULES), self.__feature_type_service, FeatureTypeSerializer),
                middlewares=middlewares
            ),
            methods=['GET', 'PUT', 'DELETE']
        )
        self.flask_app.add_url_rule(
            '/api/feature_values',
            view_func=AbstractView.as_view(
                'feature_values',
                concrete_view=FeatureValueListView(Validator(
                    CREATE_FEATURE_VALUE_VALIDATION_RULES), self.__feature_value_service, FeatureValueSerializer),
                middlewares=middlewares
            ),
            methods=['GET', 'POST']
        )
        self.flask_app.add_url_rule(
            '/api/feature_values/<int:feature_value_id>',
            view_func=AbstractView.as_view(
                'feature_value',
                concrete_view=FeatureValueDetailView(Validator(
                    UPDATE_FEATURE_VALUE_VALIDATION_RULES), self.__feature_value_service, FeatureValueSerializer),
                middlewares=middlewares
            ),
            methods=['GET', 'PUT', 'DELETE']
        )
        self.flask_app.add_url_rule(
            '/api/products',
            view_func=AbstractView.as_view(
                'products',
                concrete_view=ProductListView(Validator(
                    CREATE_PRODUCT_VALIDATION_RULES), self.__product_service, ProductSerializer),
                middlewares=middlewares
            ),
            methods=['GET', 'POST']
        )
        self.flask_app.add_url_rule(
            '/api/products/<int:product_id>',
            view_func=AbstractView.as_view(
                'product',
                concrete_view=ProductDetailView(Validator(
                    UPDATE_PRODUCT_VALIDATION_RULES), self.__product_service, ProductSerializer),
                middlewares=middlewares
            ),
            methods=['GET', 'PUT', 'DELETE']
        )
        self.flask_app.add_url_rule(
            '/api/product_types/<int:product_type_id>/products',
            view_func=AbstractView.as_view(
                'product_type_products',
                concrete_view=ProductByProductTypeView(
                    self.__product_service, ProductSerializer),
                middlewares=middlewares
            ),
            methods=['GET']
        )
        self.flask_app.add_url_rule(
            '/api/products/for_cart',
            view_func=AbstractView.as_view(
                'products_for_cart',
                concrete_view=ProductForCartView(
                    self.__product_service, ProductSerializer),
                middlewares=middlewares
            ),
            methods=['GET']
        )
        self.flask_app.add_url_rule(
            '/api/product_types',
            view_func=AbstractView.as_view(
                'product_types',
                concrete_view=ProductTypeListView(Validator(
                    CREATE_PRODUCT_TYPE_VALIDATION_RULES), self.__product_type_service, ProductTypeSerializer),
                middlewares=middlewares
            ),
            methods=['GET', 'POST']
        )
        self.flask_app.add_url_rule(
            '/api/product_types/<int:product_type_id>',
            view_func=AbstractView.as_view(
                'product_type',
                concrete_view=ProductTypeDetailView(Validator(
                    UPDATE_PRODUCT_TYPE_VALIDATION_RULES), self.__product_type_service, ProductTypeSerializer),
                middlewares=middlewares
            ),
            methods=['GET', 'PUT', 'DELETE']
        )
        self.flask_app.add_url_rule(
            '/api/product_types/newest',
            view_func=AbstractView.as_view(
                'product_type_newest',
                concrete_view=ProductTypeNewestView(
                    self.__product_type_service, ProductTypeSerializer),
                middlewares=middlewares
            ),
            methods=['GET']
        )
        self.flask_app.add_url_rule(
            '/api/languages',
            view_func=AbstractView.as_view(
                'languages',
                concrete_view=LanguageListView(
                    self.__language_service, LanguageSerializer),
                middlewares=middlewares
            ),
            methods=['GET']
        )
        self.flask_app.add_url_rule(
            '/api/banners',
            view_func=AbstractView.as_view(
                'banners',
                concrete_view=BannerListView(Validator(
                    CREATE_BANNER_VALIDATION_RULES), self.__banner_service, BannerSerializer),
                middlewares=middlewares
            ),
            methods=['GET', 'POST']
        )
        self.flask_app.add_url_rule(
            '/api/banners/<int:banner_id>',
            view_func=AbstractView.as_view(
                'banner',
                concrete_view=BannerDetailView(Validator(
                    UPDATE_BANNER_VALIDATION_RULES), self.__banner_service, BannerSerializer),
                middlewares=middlewares
            ),
            methods=['GET', 'PUT', 'DELETE']
        )

    def __handle_media_request(self, path):
        abs_media_path = os.path.join(APP_ROOT_PATH, 'media')
        abs_path = os.path.join(abs_media_path, path)
        if os.path.isfile(abs_path):
            return send_from_directory(abs_media_path, path)

        return '', 404

    def __init_media_route(self):
        self.flask_app.add_url_rule(
            '/media/<path:path>',
            view_func=self.__handle_media_request,
            methods=['GET']
        )
