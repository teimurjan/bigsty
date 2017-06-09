from django.conf.urls import url, include

from api.views import *

urlpatterns = [
  url(r'^login$', LoginView.as_view()),
  url(r'^register$', RegistrationView.as_view()),
  url(r'^categories$', CategoryListView.as_view()),
  url(r'^categories/(?P<category_id>\d+)$', CategoryView.as_view()),
  url(r'^categories/(?P<category_id>\d+)/products$', ProductListView.as_view()),
  url(r'^products$', ProductListView.as_view()),
  url(r'^products/(?P<product_id>\d+)$', ProductView.as_view()),
  url(r'^users$', UserListView.as_view()),
  url(r'^users/(?P<user_id>\d+)$', UserView.as_view()),
]
