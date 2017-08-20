from django.conf.urls import url, include

from api.views import *

urlpatterns = [
  url(r'^login$', LoginView.as_view()),
  url(r'^register$', RegistrationView.as_view()),

  url(r'^categories$', CategoryListView.as_view()),
  url(r'^categories/(?P<model_id>\d+)$', CategoryView.as_view()),

  url(r'^product_types$', ProductTypeListView.as_view()),
  url(r'^product_types/(?P<model_id>\d+)$', ProductTypeView.as_view()),

  url(r'^feature_types$', FeatureTypeListView.as_view()),
  url(r'^feature_types/(?P<model_id>\d+)$', FeatureTypeView.as_view()),

  url(r'^feature_values$', FeatureValueListView.as_view()),
  url(r'^feature_values/(?P<model_id>\d+)$', FeatureValueView.as_view()),

  url(r'^users$', UserListView.as_view()),
  url(r'^users/(?P<model_id>\d+)$', UserView.as_view()),

  url(r'^products$', ProductListView.as_view()),
  url(r'^products/(?P<model_id>\d+)$', ProductView.as_view())
]
