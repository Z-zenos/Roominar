from celery import Celery

from backend.core.config import settings

app = Celery(
    __name__,
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    # tasks="[queue-name].tasks",
    # include=["backend.background_tasks"],
)
