from rest_framework import serializers
from api.models import Speaker, Session


class SpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speaker
        fields = ('id', 'name', 'session')


class SessionSerializer(serializers.ModelSerializer):
    speakers = SpeakerSerializer()

    class Meta:
        model = Session
        fields = ('id', 'name', 'speakers')
