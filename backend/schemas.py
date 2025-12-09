from datetime import datetime, date
from typing import List, Optional

from pydantic import BaseModel, Field


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: str
    project_id: Optional[int] = None
    priority_mode: str = "none"
    priority_level: int = 0
    priority_period_start: Optional[datetime] = None
    priority_period_end: Optional[datetime] = None
    soft_deadline: Optional[datetime] = None
    hard_deadline: Optional[datetime] = None
    status: str = "planned"
    completed_at: Optional[datetime] = None
    tags: str = ""


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    project_id: Optional[int] = None
    priority_mode: Optional[str] = None
    priority_level: Optional[int] = None
    priority_period_start: Optional[datetime] = None
    priority_period_end: Optional[datetime] = None
    soft_deadline: Optional[datetime] = None
    hard_deadline: Optional[datetime] = None
    status: Optional[str] = None
    completed_at: Optional[datetime] = None
    tags: Optional[str] = None


class Task(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class TaskProgressBase(BaseModel):
    progress_value: int = Field(ge=0, le=100)
    effort_score: int = Field(ge=1, le=5)
    comment: Optional[str] = None


class TaskProgressCreate(TaskProgressBase):
    pass


class TaskProgress(TaskProgressBase):
    id: int
    task_id: int
    timestamp: datetime

    class Config:
        orm_mode = True


class WorkStateBase(BaseModel):
    date: date
    self_rating: int
    notes: Optional[str] = None


class WorkState(WorkStateBase):
    id: int

    class Config:
        orm_mode = True


class AnalyticsSummary(BaseModel):
    created_tasks: int
    completed_tasks: int
    failed_tasks: int
    completed_per_day: List[dict]
    average_effort_per_day: List[dict]


class TaskAnalytics(BaseModel):
    task_id: int
    progress: List[TaskProgress]
