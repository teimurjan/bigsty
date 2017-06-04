from django.conf.urls import *
from store.views import *

urlpatterns = [
    url(r'^', Index.as_view(), name='index'),
]