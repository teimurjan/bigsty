from src.abstract_view import AbstractView
from src.factories.middlewares.http.authorize import AuthorizeHttpMiddlewareFactory
from src.factories.middlewares.http.language import LanguageHttpMiddlewareFactory
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

DEFAULT_MIDDLEWARE_FACTORIES = [
    LanguageHttpMiddlewareFactory,
    AuthorizeHttpMiddlewareFactory,
]


class API:
    def __init__(self, app, db_conn):
        app.add_url_rule(
            'auth/login',
            view_func=AbstractView.as_view(
                concrete_view_factory=AuthenticationViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
        app.add_url_rule(
            'auth/register',
            view_func=AbstractView.as_view(
                concrete_view_factory=RegistrationViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
        app.add_url_rule(
            'auth/refresh',
            view_func=AbstractView.as_view(
                concrete_view_factory=RefreshTokenViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
        app.add_url_rule(
            'categories',
            view_func=AbstractView.as_view(
                concrete_view_factory=CategoryListViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
        app.add_url_rule(
            'categories/<int:category_id>',
            view_func=AbstractView.as_view(
                concrete_view_factory=CategoryDetailViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
        app.add_url_rule(
            'categories/<int:category_id>/product_types',
            view_func=AbstractView.as_view(
                concrete_view_factory=ProductTypeByCategoryViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
        app.add_url_rule(
            'feature_types',
            view_func=AbstractView.as_view(
                concrete_view_factory=FeatureTypeListViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
        app.add_url_rule(
            'feature_types/<int:feature_type_id>',
            view_func=AbstractView.as_view(
                concrete_view_factory=FeatureTypeDetailViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
        app.add_url_rule(
            'feature_values',
            view_func=AbstractView.as_view(
                concrete_view_factory=FeatureValueListViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
        app.add_url_rule(
            'feature_values/<int:feature_value_id>',
            view_func=AbstractView.as_view(
                concrete_view_factory=FeatureValueDetailViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
        app.add_url_rule(
            'products',
            view_func=AbstractView.as_view(
                concrete_view_factory=ProductListViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
        app.add_url_rule(
            'products/<int:product_id>',
            view_func=AbstractView.as_view(
                concrete_view_factory=ProductDetailViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
        app.add_url_rule(
            'product_types',
            view_func=AbstractView.as_view(
                concrete_view_factory=ProductTypeListViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
        app.add_url_rule(
            'product_types/<int:product_type_id>',
            view_func=AbstractView.as_view(
                concrete_view_factory=ProductTypeDetailViewFactory(db_conn),
                middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
            )
        )
