import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container, Stack } from '@mui/material'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'
import TaskDetailsPage from './pages/TaskDetailsPage'
import AnalyticsPage from './pages/AnalyticsPage'

const App = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Planner
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button color="inherit" component={Link} to="/">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/tasks">
              Tasks
            </Button>
            <Button color="inherit" component={Link} to="/analytics">
              Analytics
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
