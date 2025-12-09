from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter(prefix="/api/tasks", tags=["progress"])


@router.get("/{task_id}/progress", response_model=List[schemas.TaskProgress])
def get_progress(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return (
        db.query(models.TaskProgress)
        .filter(models.TaskProgress.task_id == task_id)
        .order_by(models.TaskProgress.timestamp.asc())
        .all()
    )


@router.post("/{task_id}/progress", response_model=schemas.TaskProgress, status_code=201)
def add_progress(task_id: int, payload: schemas.TaskProgressCreate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    progress_entry = models.TaskProgress(task_id=task_id, **payload.dict())
    db.add(progress_entry)
    db.commit()
    db.refresh(progress_entry)
    return progress_entry
