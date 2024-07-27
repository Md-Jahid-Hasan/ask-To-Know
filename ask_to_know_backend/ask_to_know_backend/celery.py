import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ask_to_know_backend.settings")
app = Celery("ask_to_know_backend")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
