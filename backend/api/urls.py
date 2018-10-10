from django.urls import path

from api.utils.view_wrapper import ViewWrapper
from api.factories.views.authentication import AuthenticationViewFactory
from api.factories.views.registration import RegistrationViewFactory
from api.factories.views.refresh_token import RefreshTokenViewFactory
from api.factories.views.category.list import CategoryListViewFactory
from api.factories.views.feature_type.list import FeatureTypeListViewFactory
from api.factories.views.feature_value.list import FeatureValueListViewFactory
from api.factories.views.product.list import ProductListViewFactory
from api.factories.views.product_type.list import ProductTypeListViewFactory
from api.factories.middlewares.http.authorize import AuthorizeHttpMiddlewareFactory
from api.factories.middlewares.http.language import LanguageHttpMiddlewareFactory

DEFAULT_MIDDLEWARE_FACTORIES = [
    LanguageHttpMiddlewareFactory
]

urlpatterns = [
    path('auth/login', ViewWrapper.as_view(
        view_factory=AuthenticationViewFactory,
        middleware_factories=[*DEFAULT_MIDDLEWARE_FACTORIES])
    ),
    path('auth/register', ViewWrapper.as_view(
        view_factory=RegistrationViewFactory,
        middleware_factories=[*DEFAULT_MIDDLEWARE_FACTORIES])
    ),
    path('auth/refresh', ViewWrapper.as_view(
        view_factory=RefreshTokenViewFactory,
        middleware_factories=[
            *DEFAULT_MIDDLEWARE_FACTORIES, AuthorizeHttpMiddlewareFactory
        ]
    )),

    path('categories', ViewWrapper.as_view(
        view_factory=CategoryListViewFactory,
        middleware_factories=[
            *DEFAULT_MIDDLEWARE_FACTORIES, AuthorizeHttpMiddlewareFactory
        ]
    )),


    path('feature_types', ViewWrapper.as_view(
        view_factory=FeatureTypeListViewFactory,
        middleware_factories=[
            *DEFAULT_MIDDLEWARE_FACTORIES, AuthorizeHttpMiddlewareFactory
        ]
    )),

    path('feature_values', ViewWrapper.as_view(
        view_factory=FeatureValueListViewFactory,
        middleware_factories=[
            *DEFAULT_MIDDLEWARE_FACTORIES, AuthorizeHttpMiddlewareFactory
        ]
    )),

    path('products', ViewWrapper.as_view(
        view_factory=ProductListViewFactory,
        middleware_factories=[
            *DEFAULT_MIDDLEWARE_FACTORIES, AuthorizeHttpMiddlewareFactory
        ]
    )),

    path('product_types', ViewWrapper.as_view(
        view_factory=ProductTypeListViewFactory,
        middleware_factories=[
            *DEFAULT_MIDDLEWARE_FACTORIES, AuthorizeHttpMiddlewareFactory
        ]
    )),
]
