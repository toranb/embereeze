from django.conf.urls import patterns, url
from api.views import SessionList, SessionDetail, SpeakerList, SpeakerDetail

urlpatterns = patterns('',
    url(r'^speakers/(?P<pk>\d+)/$', SpeakerDetail.as_view()),
    url(r'^sessions/(?P<session_pk>\d+)/speakers/$', SpeakerList.as_view()),
    url(r'^sessions/(?P<pk>\d+)/$', SessionDetail.as_view()),
    url(r'^sessions/$', SessionList.as_view()),
)
