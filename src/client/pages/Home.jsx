import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HostName } from '../util/HostName';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  People,
  TrendingUp,
  AssignmentTurnedIn,
  Refresh,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Home() {
  const [dashboardData, setDashboardData] = useState({
    userCount: 0,
    activeUsers: 0,
    completedTasks: 0,
    userGrowth: [],
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch user count
      const userCountResponse = await axios.get(`${HostName}/api/admin/user/count`, { withCredentials: true });
      
      // Fetch other mock data (replace these with actual API calls when available)
      const activeUsersResponse = { data: { ok: true, count: 150 } };
      const completedTasksResponse = { data: { ok: true, count: 1250 } };
      const userGrowthResponse = { data: { ok: true, growth: [
        { date: '2023-05-01', users: 100 },
        { date: '2023-05-02', users: 120 },
        { date: '2023-05-03', users: 115 },
        { date: '2023-05-04', users: 130 },
        { date: '2023-05-05', users: 140 },
        { date: '2023-05-06', users: 135 },
        { date: '2023-05-07', users: 150 },
      ] } };
      const recentActivitiesResponse = { data: { ok: true, activities: [
        { id: 1, user: 'John Doe', action: 'Completed task', timestamp: '2023-05-07T10:30:00Z' },
        { id: 2, user: 'Jane Smith', action: 'Created new project', timestamp: '2023-05-07T09:45:00Z' },
        { id: 3, user: 'Bob Johnson', action: 'Updated profile', timestamp: '2023-05-07T08:15:00Z' },
      ] } };

      if (userCountResponse.data.ok && 
          activeUsersResponse.data.ok && 
          completedTasksResponse.data.ok &&
          userGrowthResponse.data.ok &&
          recentActivitiesResponse.data.ok) {
        setDashboardData({
          userCount: userCountResponse.data.count,
          activeUsers: activeUsersResponse.data.count,
          completedTasks: completedTasksResponse.data.count,
          userGrowth: userGrowthResponse.data.growth,
          recentActivities: recentActivitiesResponse.data.activities,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <IconButton onClick={fetchDashboardData} color="primary">
          <Refresh />
        </IconButton>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Users" value={dashboardData.userCount} icon={<People />} color="#3f51b5" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Active Users" value={dashboardData.activeUsers} icon={<TrendingUp />} color="#4caf50" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Completed Tasks" value={dashboardData.completedTasks} icon={<AssignmentTurnedIn />} color="#ff9800" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="User Growth" value={`${((dashboardData.userGrowth[dashboardData.userGrowth.length - 1]?.users - dashboardData.userGrowth[0]?.users) / dashboardData.userGrowth[0]?.users * 100).toFixed(2)}%`} icon={<ArrowUpward />} color="#e91e63" />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                User Growth
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {dashboardData.recentActivities.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={activity.user}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {activity.action}
                            </Typography>
                            {` — ${new Date(activity.timestamp).toLocaleString()}`}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Home;