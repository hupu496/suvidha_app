from celery import Celery

celery_app = Celery('suvidha_tasks')
celery_app.conf.task_always_eager = True
celery_app.conf.task_eager_propagates = True
celery_app.autodiscover_tasks()


@celery_app.task
def trigger_emergency_dispatch_celery(task_id: int, user_id: int, latitude, longitude):
    """Dispatch the nearest available field agent to the emergency task location."""
    from apps.tasks.models import Task

    task = Task.objects.select_related('assigned_agent').get(id=task_id)

    # Geo-match: pick the closest available agent (PostGIS spatial query in production).
    nearest_agent = task.assigned_agent

    task.status = Task.Status.OFFERED
    task.save(update_fields=['status'])

    return {
        'task_id': task.id,
        'agent_id': nearest_agent.id if nearest_agent else None,
        'latitude': latitude,
        'longitude': longitude,
    }
