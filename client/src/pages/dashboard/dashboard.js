import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, CardActions, Button } from '@mui/material';
import './dashboard.css'

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom textAlign={'center'}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Investments
              </Typography>
              <Typography variant="h4">
                $50,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Pending Investments
              </Typography>
              <Typography variant="h4">
                $5,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Completed Investments
              </Typography>
              <Typography variant="h4">
                $45,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography>Activity 1</Typography>
              <Typography>Activity 2</Typography>
              <Typography>Activity 3</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Investment Chart
            </Typography>
            <Box sx={{ mt: 2 }}>
              {/* Insert chart component here */}
              <Typography>Chart will be here</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" sx={{ mb: 2, backgroundColor: '#f16c1d' }}>Add New Investment</Button>
              <Button variant="contained" sx={{ backgroundColor: '#f16c1d' }}>View Reports</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
