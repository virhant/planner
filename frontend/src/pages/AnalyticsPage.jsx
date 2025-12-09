import React, { useEffect, useState } from 'react'
import { Card, CardContent, Stack, Typography, TextField, Grid } from '@mui/material'
import dayjs from 'dayjs'
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts'
import { fetchAnalyticsSummary } from '../services/api'

const AnalyticsPage = () => {
  const [range, setRange] = useState({ from: dayjs().subtract(7, 'day').format('YYYY-MM-DD'), to: dayjs().format('YYYY-MM-DD') })
  const [summary, setSummary] = useState(null)

  const load = () => {
    fetchAnalyticsSummary({ from: range.from, to: range.to }).then((res) => setSummary(res.data))
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    load()
  }, [range.from, range.to])

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Analytics</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              type="date"
              label="From"
              InputLabelProps={{ shrink: true }}
              value={range.from}
              onChange={(e) => setRange({ ...range, from: e.target.value })}
            />
            <TextField
              type="date"
              label="To"
              InputLabelProps={{ shrink: true }}
              value={range.to}
              onChange={(e) => setRange({ ...range, to: e.target.value })}
            />
          </Stack>

          {summary && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography>Completed tasks per day</Typography>
                <BarChart width={400} height={250} data={summary.completed_per_day}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>Average effort per day</Typography>
                <LineChart width={400} height={250} data={summary.average_effort_per_day}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="average_effort" stroke="#82ca9d" />
                </LineChart>
              </Grid>
            </Grid>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default AnalyticsPage
