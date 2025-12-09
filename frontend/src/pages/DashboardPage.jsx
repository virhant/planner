import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography, Grid, Button, Chip, Stack } from '@mui/material'
import dayjs from 'dayjs'
import { fetchTasks, fetchAnalyticsSummary } from '../services/api'

const DashboardPage = () => {
  const [tasks, setTasks] = useState([])
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    fetchTasks().then((res) => setTasks(res.data)).catch(() => setTasks([]))
    fetchAnalyticsSummary().then((res) => setSummary(res.data)).catch(() => setSummary(null))
  }, [])

  const today = dayjs()
  const todayTasks = tasks.filter((task) => task.soft_deadline && dayjs(task.soft_deadline).isSame(today, 'day'))
  const overdueTasks = tasks.filter(
    (task) =>
      task.status !== 'completed' &&
      ((task.soft_deadline && dayjs(task.soft_deadline).isBefore(today)) ||
        (task.hard_deadline && dayjs(task.hard_deadline).isBefore(today)))
  )

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Today & Upcoming</Typography>
                <Button variant="contained" href="/tasks">
                  Create Task
                </Button>
              </Stack>
              {todayTasks.length === 0 && <Typography color="text.secondary">No tasks scheduled for today.</Typography>}
              <Stack spacing={1} mt={2}>
                {todayTasks.map((task) => (
                  <Stack key={task.id} direction="row" spacing={1} alignItems="center">
                    <Typography>{task.title}</Typography>
                    <Chip size="small" label={task.status} />
                    {task.soft_deadline && <Chip size="small" label={dayjs(task.soft_deadline).format('HH:mm')} />}
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Summary</Typography>
              {summary ? (
                <Stack spacing={1} mt={1}>
                  <Typography>Created tasks: {summary.created_tasks}</Typography>
                  <Typography>Completed tasks: {summary.completed_tasks}</Typography>
                  <Typography>Failed tasks: {summary.failed_tasks}</Typography>
                </Stack>
              ) : (
                <Typography color="text.secondary">No summary available.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6">Overdue</Typography>
          {overdueTasks.length === 0 && <Typography color="text.secondary">No overdue tasks 🎉</Typography>}
          <Stack spacing={1} mt={1}>
            {overdueTasks.map((task) => (
              <Stack key={task.id} direction="row" spacing={1} alignItems="center">
                <Typography>{task.title}</Typography>
                <Chip size="small" color="error" label="Overdue" />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default DashboardPage
