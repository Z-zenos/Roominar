from celery import Celery

from backend.core.config import settings

app = Celery(
    "celery_workers",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    tasks="[queue-name].tasks",
    include=["backend.background_tasks"],
)
