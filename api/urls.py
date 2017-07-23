from django.conf.urls import url, include

from api.views import *

urlpatterns = [
  url(r'^login$', LoginView.as_view()),
  url(r'^register$', RegistrationView.as_view()),
  url(r'^categories$', CategoryListView.as_view()),
  url(r'^categories/(?P<category_id>\d+)$', CategoryView.as_view()),
  url(r'^categories/(?P<category_id>\d+)/products$', ProductTypeListView.as_view()),
  url(r'^product_types$', ProductTypeListView.as_view()),
  url(r'^product_types/(?P<product_type_id>\d+)$', ProductTypeView.as_view()),
  url(r'^feature_types$', FeatureTypeListView.as_view()),
  url(r'^users$', UserListView.as_view()),
  url(r'^users/(?P<user_id>\d+)$', UserView.as_view()),
]
