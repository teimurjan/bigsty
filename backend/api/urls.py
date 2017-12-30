from django.conf.urls import url

from api.views import *
from api.views.group import GroupListView

urlpatterns = [
  url(r'^login$', LoginView.as_view(), name='login'),
  url(r'^register$', RegistrationView.as_view(), name='register'),

  url(r'^categories$', CategoryListView.as_view(), name='categories'),
  url(r'^categories/(?P<model_id>\d+)$', CategoryView.as_view(), name='categories'),

  url(r'^product_types$', ProductTypeListView.as_view(), name='product_types'),
  url(r'^product_types/(?P<model_id>\d+)$', ProductTypeView.as_view(), name='product_type'),

  url(r'^feature_types$', FeatureTypeListView.as_view(), name='feature_types'),
  url(r'^feature_types/(?P<model_id>\d+)$', FeatureTypeView.as_view(), name='feature_type'),

  url(r'^feature_values$', FeatureValueListView.as_view(), name='feature_values'),
  url(r'^feature_values/(?P<model_id>\d+)$', FeatureValueView.as_view(), name='feature_value'),

  url(r'^users$', UserListView.as_view(), name='users'),
  url(r'^users/(?P<model_id>\d+)$', UserView.as_view(), name='user'),

  url(r'^products$', ProductListView.as_view(), name='products'),
  url(r'^products/(?P<model_id>\d+)$', ProductView.as_view(), name='product'),

  url(r'^groups$', GroupListView.as_view(), name='groups')
]
