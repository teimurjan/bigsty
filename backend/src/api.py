import os
from flask import send_from_directory

from src.abstract_view import AbstractView
from src.factories.views.authentication import AuthenticationViewFactory
from src.factories.views.registration import RegistrationViewFactory
from src.factories.views.refresh_token import RefreshTokenViewFactory
from src.factories.views.category.list import CategoryListViewFactory
from src.factories.views.category.detail import CategoryDetailViewFactory
from src.factories.views.feature_type.list import FeatureTypeListViewFactory
from src.factories.views.feature_type.detail import FeatureTypeDetailViewFactory
from src.factories.views.feature_value.list import FeatureValueListViewFactory
from src.factories.views.feature_value.detail import FeatureValueDetailViewFactory
from src.factories.views.product.list import ProductListViewFactory
from src.factories.views.product.detail import ProductDetailViewFactory
from src.factories.views.product_type.list import ProductTypeListViewFactory
from src.factories.views.product_type.detail import ProductTypeDetailViewFactory
from src.factories.views.product_type.by_category import ProductTypeByCategoryViewFactory


class API:
    def __init__(self, app, db_conn, middlewares):    
        app.add_url_rule(
            '/api/auth/login',
            view_func=AbstractView.as_view(
                'login',
                concrete_view_factory=AuthenticationViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['POST']
        )
        app.add_url_rule(
            '/api/auth/register',
            view_func=AbstractView.as_view(
                'register',
                concrete_view_factory=RegistrationViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['POST']
        )
        app.add_url_rule(
            '/api/auth/refresh',
            view_func=AbstractView.as_view(
                'refresh_token',
                concrete_view_factory=RefreshTokenViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['POST']

        )
        app.add_url_rule(
            '/api/categories',
            view_func=AbstractView.as_view(
                'categories',
                concrete_view_factory=CategoryListViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['GET', 'POST']
        )
        app.add_url_rule(
            '/api/categories/<int:category_id>',
            view_func=AbstractView.as_view(
                'category',
                concrete_view_factory=CategoryDetailViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['GET', 'PUT', 'DELETE']
        )
        app.add_url_rule(
            '/api/categories/<int:category_id>/product_types',
            view_func=AbstractView.as_view(
                'category_product_types',
                concrete_view_factory=ProductTypeByCategoryViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['GET']
        )
        app.add_url_rule(
            '/api/feature_types',
            view_func=AbstractView.as_view(
                'feature_types',
                concrete_view_factory=FeatureTypeListViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['GET', 'POST']
        ),
        app.add_url_rule(
            '/api/feature_types/<int:feature_type_id>',
            view_func=AbstractView.as_view(
                'feature_type',
                concrete_view_factory=FeatureTypeDetailViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['GET', 'PUT', 'DELETE']
        )
        app.add_url_rule(
            '/api/feature_values',
            view_func=AbstractView.as_view(
                'feature_values',
                concrete_view_factory=FeatureValueListViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['GET', 'POST']
        )
        app.add_url_rule(
            '/api/feature_values/<int:feature_value_id>',
            view_func=AbstractView.as_view(
                'feature_value',
                concrete_view_factory=FeatureValueDetailViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['GET', 'PUT', 'DELETE']
        )
        app.add_url_rule(
            '/api/products',
            view_func=AbstractView.as_view(
                'products',
                concrete_view_factory=ProductListViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['GET', 'POST']
        )
        app.add_url_rule(
            '/api/products/<int:product_id>',
            view_func=AbstractView.as_view(
                'product',
                concrete_view_factory=ProductDetailViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['GET', 'PUT', 'DELETE']
        )
        app.add_url_rule(
            '/api/product_types',
            view_func=AbstractView.as_view(
                'product_types',
                concrete_view_factory=ProductTypeListViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['GET', 'POST']
        )
        app.add_url_rule(
            '/api/product_types/<int:product_type_id>',
            view_func=AbstractView.as_view(
                'product_type',
                concrete_view_factory=ProductTypeDetailViewFactory(db_conn),
                middlewares=middlewares
            ),
            methods=['GET', 'PUT', 'DELETE']
        )
