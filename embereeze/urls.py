from django.views.generic import TemplateView
from django.conf.urls import patterns, include, url

from api import urls as api_urls

class Index(TemplateView):
    template_name = 'index.html'

urlpatterns = patterns('',
    url(r'^$', Index.as_view()),
    url(r'^api/', include(api_urls, namespace='api')),
)
