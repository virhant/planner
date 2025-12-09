from collections import defaultdict
from datetime import datetime, date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


def parse_date(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


@router.get("/summary", response_model=schemas.AnalyticsSummary)
def analytics_summary(from_: Optional[str] = None, to: Optional[str] = None, db: Session = Depends(get_db)):
    start = parse_date(from_)
    end = parse_date(to)

    task_query = db.query(models.Task)
    if start:
        task_query = task_query.filter(models.Task.created_at >= start)
    if end:
        task_query = task_query.filter(models.Task.created_at <= end)
    created_tasks = task_query.count()

    completed_query = db.query(models.Task).filter(models.Task.status == "completed")
    if start:
        completed_query = completed_query.filter(models.Task.completed_at >= start)
    if end:
        completed_query = completed_query.filter(models.Task.completed_at <= end)
    completed_tasks = completed_query.count()

    failed_query = db.query(models.Task).filter(models.Task.status != "completed")
    if end:
        failed_query = failed_query.filter(models.Task.hard_deadline <= end)
    failed_tasks = failed_query.count()

    completed_per_day = (
        db.query(func.date(models.Task.completed_at), func.count(models.Task.id))
        .filter(models.Task.status == "completed")
        .group_by(func.date(models.Task.completed_at))
        .all()
    )
    completed_series = [
        {"date": str(day), "count": count}
        for day, count in completed_per_day
        if day is not None
    ]

    effort_per_day = (
        db.query(func.date(models.TaskProgress.timestamp), func.avg(models.TaskProgress.effort_score))
        .group_by(func.date(models.TaskProgress.timestamp))
        .all()
    )
    effort_series = [
        {"date": str(day), "average_effort": float(avg) if avg is not None else 0}
        for day, avg in effort_per_day
    ]

    return schemas.AnalyticsSummary(
        created_tasks=created_tasks,
        completed_tasks=completed_tasks,
        failed_tasks=failed_tasks,
        completed_per_day=completed_series,
        average_effort_per_day=effort_series,
    )


@router.get("/task/{task_id}", response_model=schemas.TaskAnalytics)
def task_analytics(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    progress_entries = (
        db.query(models.TaskProgress)
        .filter(models.TaskProgress.task_id == task_id)
        .order_by(models.TaskProgress.timestamp.asc())
        .all()
    )
    return schemas.TaskAnalytics(task_id=task_id, progress=progress_entries)
