from rest_framework import generics
from api.models import Speaker, Session
from api.serializers import SpeakerSerializer, SessionSerializer


class SessionList(generics.ListCreateAPIView):
    model = Session
    serializer_class = SessionSerializer


class SessionDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Session
    serializer_class = SessionSerializer


class SpeakerList(generics.ListCreateAPIView):
    model = Speaker
    serializer_class = SpeakerSerializer

    def get_queryset(self):
        session_pk = self.kwargs.get('session_pk', None)
        if session_pk is not None:
            return Speaker.objects.filter(session__pk=session_pk)
        return []


class SpeakerDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Speaker
    serializer_class = SpeakerSerializer
