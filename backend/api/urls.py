from django.urls import path

from api.abstract_view import AbstractView
from api.factories.middlewares.http.authorize import AuthorizeHttpMiddlewareFactory
from api.factories.middlewares.http.language import LanguageHttpMiddlewareFactory
from api.factories.http.request_data_parser import RequestDataParserFactory
from api.factories.views.authentication import AuthenticationViewFactory

from api.factories.views.registration import RegistrationViewFactory

from api.factories.views.refresh_token import RefreshTokenViewFactory

from api.factories.views.category.list import CategoryListViewFactory
from api.factories.views.category.detail import CategoryDetailViewFactory

from api.factories.views.feature_type.list import FeatureTypeListViewFactory
from api.factories.views.feature_type.detail import FeatureTypeDetailViewFactory

from api.factories.views.feature_value.list import FeatureValueListViewFactory
from api.factories.views.feature_value.detail import FeatureValueDetailViewFactory

from api.factories.views.product.list import ProductListViewFactory
from api.factories.views.product.detail import ProductDetailViewFactory

from api.factories.views.product_type.list import ProductTypeListViewFactory
from api.factories.views.product_type.detail import ProductTypeDetailViewFactory


DEFAULT_MIDDLEWARE_FACTORIES = [
    LanguageHttpMiddlewareFactory,
    AuthorizeHttpMiddlewareFactory,
]

urlpatterns = [
    path('auth/login', AbstractView.as_view(
        concrete_view_factory=AuthenticationViewFactory,
        request_data_parser_factory=RequestDataParserFactory,
        middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
    )),
    path('auth/register', AbstractView.as_view(
        concrete_view_factory=RegistrationViewFactory,
        request_data_parser_factory=RequestDataParserFactory,
        middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
    )),
    path('auth/refresh', AbstractView.as_view(
        concrete_view_factory=RefreshTokenViewFactory,
        request_data_parser_factory=RequestDataParserFactory,
        middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
    )),
    path('categories', AbstractView.as_view(
        concrete_view_factory=CategoryListViewFactory,
        request_data_parser_factory=RequestDataParserFactory,
        middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
    )),
    path('categories/<int:category_id>', AbstractView.as_view(
        concrete_view_factory=CategoryDetailViewFactory,
        request_data_parser_factory=RequestDataParserFactory,
        middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
    )),
    path('feature_types', AbstractView.as_view(
        concrete_view_factory=FeatureTypeListViewFactory,
        request_data_parser_factory=RequestDataParserFactory,
        middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
    )),
    path('feature_types/<int:feature_type_id>', AbstractView.as_view(
        concrete_view_factory=FeatureTypeDetailViewFactory,
        request_data_parser_factory=RequestDataParserFactory,
        middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
    )),
    path('feature_values', AbstractView.as_view(
        concrete_view_factory=FeatureValueListViewFactory,
        request_data_parser_factory=RequestDataParserFactory,
        middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
    )),
    path('feature_values/<int:feature_value_id>', AbstractView.as_view(
        concrete_view_factory=FeatureValueDetailViewFactory,
        request_data_parser_factory=RequestDataParserFactory,
        middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
    )),
    path('products', AbstractView.as_view(
        concrete_view_factory=ProductListViewFactory,
        request_data_parser_factory=RequestDataParserFactory,
        middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
    )),
    path('products/<int:product_id>', AbstractView.as_view(
        concrete_view_factory=ProductDetailViewFactory,
        request_data_parser_factory=RequestDataParserFactory,
        middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
    )),
    path('product_types', AbstractView.as_view(
        concrete_view_factory=ProductTypeListViewFactory,
        request_data_parser_factory=RequestDataParserFactory,
        middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
    )),
    path('product_types/<int:product_type_id>', AbstractView.as_view(
        concrete_view_factory=ProductTypeDetailViewFactory,
        request_data_parser_factory=RequestDataParserFactory,
        middleware_factories=DEFAULT_MIDDLEWARE_FACTORIES
    )),
]
