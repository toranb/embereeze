from django.db import models


class Session(models.Model):
    name = models.CharField(max_length=25)


class Speaker(models.Model):
    name = models.CharField(max_length=25)
    session = models.ForeignKey(Session, related_name='speakers')
