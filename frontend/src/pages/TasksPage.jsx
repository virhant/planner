import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { fetchTasks, deleteTask, updateTask } from '../services/api'

const statusOptions = ['planned', 'in_progress', 'completed', 'failed', 'paused']
const typeOptions = ['task_short', 'task_long', 'project']

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const navigate = useNavigate()

  const loadTasks = () => {
    fetchTasks().then((res) => setTasks(res.data)).catch(() => setTasks([]))
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => (statusFilter ? task.status === statusFilter : true))
      .filter((task) => (typeFilter ? task.type === typeFilter : true))
      .filter((task) => (priorityFilter !== '' ? task.priority_level === Number(priorityFilter) : true))
  }, [tasks, statusFilter, typeFilter, priorityFilter])

  const handleDelete = async (id) => {
    if (confirm('Delete this task?')) {
      await deleteTask(id)
      loadTasks()
    }
  }

  const handleStatusChange = async (id, status) => {
    await updateTask(id, { status })
    loadTasks()
  }

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Tasks
          </Typography>
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} size="small">
            <MenuItem value="">All</MenuItem>
            {typeOptions.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="">All</MenuItem>
            {[0, 1, 2, 3].map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Soft deadline</TableCell>
              <TableCell>Hard deadline</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id} hover>
                <TableCell sx={{ cursor: 'pointer' }} onClick={() => navigate(`/tasks/${task.id}`)}>
                  {task.title}
                </TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>{task.priority_level}</TableCell>
                <TableCell>{task.soft_deadline ? dayjs(task.soft_deadline).format('YYYY-MM-DD') : '-'}</TableCell>
                <TableCell>{task.hard_deadline ? dayjs(task.hard_deadline).format('YYYY-MM-DD') : '-'}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default TasksPage
