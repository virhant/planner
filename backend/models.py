from datetime import datetime, date
from typing import Optional

from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(20), nullable=False)
    project_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    priority_mode = Column(String(20), default="none")
    priority_level = Column(Integer, default=0)
    priority_period_start = Column(DateTime, nullable=True)
    priority_period_end = Column(DateTime, nullable=True)
    soft_deadline = Column(DateTime, nullable=True)
    hard_deadline = Column(DateTime, nullable=True)
    status = Column(String(20), default="planned")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    tags = Column(String(255), default="")

    project = relationship("Task", remote_side=[id], backref="subtasks")
    progress_entries = relationship("TaskProgress", back_populates="task", cascade="all, delete-orphan")


class TaskProgress(Base):
    __tablename__ = "task_progress"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    progress_value = Column(Integer, nullable=False)
    effort_score = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)

    task = relationship("Task", back_populates="progress_entries")


class WorkState(Base):
    __tablename__ = "work_state"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=date.today, unique=True)
    self_rating = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)
