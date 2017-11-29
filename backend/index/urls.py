from django.conf.urls import *
from index.views import *

urlpatterns = [
    url(r'^', Index.as_view(), name='index'),
]