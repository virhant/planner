from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


def apply_task_filters(query, status: Optional[str], type_: Optional[str], priority_level: Optional[int], start_date: Optional[datetime], end_date: Optional[datetime]):
    if status:
        query = query.filter(models.Task.status == status)
    if type_:
        query = query.filter(models.Task.type == type_)
    if priority_level is not None:
        query = query.filter(models.Task.priority_level == priority_level)
    if start_date:
        query = query.filter(
            (models.Task.soft_deadline >= start_date) | (models.Task.hard_deadline >= start_date)
        )
    if end_date:
        query = query.filter(
            (models.Task.soft_deadline <= end_date) | (models.Task.hard_deadline <= end_date)
        )
    return query


@router.get("", response_model=List[schemas.Task])
def list_tasks(
    status: Optional[str] = None,
    type: Optional[str] = Query(None, alias="type"),
    priority_level: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Task)
    query = apply_task_filters(query, status, type, priority_level, start_date, end_date)
    return query.order_by(models.Task.created_at.desc()).all()


@router.post("", response_model=schemas.Task, status_code=201)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.get("/{task_id}", response_model=schemas.Task)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, payload: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return None
