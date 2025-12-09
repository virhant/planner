import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  MenuItem,
  Button,
  Typography,
  Divider
} from '@mui/material'
import dayjs from 'dayjs'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Bar, BarChart } from 'recharts'
import { fetchTask, updateTask, fetchTaskProgress, addTaskProgress } from '../services/api'

const statusOptions = ['planned', 'in_progress', 'completed', 'failed', 'paused']
const typeOptions = ['task_short', 'task_long', 'project']
const priorityModes = ['none', 'daily', 'weekly', 'monthly']

const TaskDetailsPage = () => {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [progressEntries, setProgressEntries] = useState([])
  const [form, setForm] = useState({})
  const [progressForm, setProgressForm] = useState({ progress_value: 0, effort_score: 3, comment: '' })

  const load = () => {
    fetchTask(id).then((res) => {
      setTask(res.data)
      setForm(res.data)
    })
    fetchTaskProgress(id).then((res) => setProgressEntries(res.data))
  }

  useEffect(() => {
    load()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateTask(id, form)
    load()
  }

  const submitProgress = async (e) => {
    e.preventDefault()
    await addTaskProgress(id, progressForm)
    setProgressForm({ progress_value: 0, effort_score: 3, comment: '' })
    load()
  }

  if (!task) return <Typography>Loading...</Typography>

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Task Details
              </Typography>
              <Stack component="form" spacing={2} onSubmit={handleSubmit}>
                <TextField label="Title" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <TextField
                  label="Description"
                  multiline
                  rows={3}
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <TextField select label="Type" value={form.type || ''} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {typeOptions.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Status"
                  value={form.status || ''}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
                <Stack direction="row" spacing={2}>
                  <TextField
                    type="date"
                    label="Soft deadline"
                    InputLabelProps={{ shrink: true }}
                    value={form.soft_deadline ? dayjs(form.soft_deadline).format('YYYY-MM-DD') : ''}
                    onChange={(e) => setForm({ ...form, soft_deadline: e.target.value })}
                  />
                  <TextField
                    type="date"
                    label="Hard deadline"
                    InputLabelProps={{ shrink: true }}
                    value={form.hard_deadline ? dayjs(form.hard_deadline).format('YYYY-MM-DD') : ''}
                    onChange={(e) => setForm({ ...form, hard_deadline: e.target.value })}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField
                    select
                    label="Priority Mode"
                    value={form.priority_mode || 'none'}
                    onChange={(e) => setForm({ ...form, priority_mode: e.target.value })}
                  >
                    {priorityModes.map((mode) => (
                      <MenuItem key={mode} value={mode}>
                        {mode}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Priority Level"
                    value={form.priority_level ?? 0}
                    onChange={(e) => setForm({ ...form, priority_level: Number(e.target.value) })}
                  >
                    {[0, 1, 2, 3].map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Add Progress
              </Typography>
              <Stack component="form" spacing={2} onSubmit={submitProgress}>
                <TextField
                  label="Progress value"
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  value={progressForm.progress_value}
                  onChange={(e) => setProgressForm({ ...progressForm, progress_value: Number(e.target.value) })}
                />
                <TextField
                  label="Effort score"
                  type="number"
                  inputProps={{ min: 1, max: 5 }}
                  value={progressForm.effort_score}
                  onChange={(e) => setProgressForm({ ...progressForm, effort_score: Number(e.target.value) })}
                />
                <TextField
                  label="Comment"
                  multiline
                  rows={2}
                  value={progressForm.comment}
                  onChange={(e) => setProgressForm({ ...progressForm, comment: e.target.value })}
                />
                <Button type="submit" variant="contained">
                  Add progress
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6">Progress</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <LineChart width={400} height={250} data={progressEntries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={(d) => dayjs(d.timestamp).format('MM-DD')} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="progress_value" stroke="#1976d2" />
              </LineChart>
            </Grid>
            <Grid item xs={12} md={6}>
              <BarChart width={400} height={250} data={progressEntries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={(d) => dayjs(d.timestamp).format('MM-DD')} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="effort_score" fill="#82ca9d" />
              </BarChart>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default TaskDetailsPage
