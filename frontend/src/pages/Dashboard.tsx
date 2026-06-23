import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  Storage,
  CloudQueue,
  Assessment,
  Warning,
  CheckCircle,
  Schedule,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Dashboard Component
 * Main dashboard showing migration overview, statistics, and recent activities
 */
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API call
      const data = {
        summary: {
          total_projects: 12,
          active_migrations: 5,
          completed_migrations: 23,
          total_data_migrated_tb: 45.7,
        },
        migration_readiness: {
          ready: 3,
          in_progress: 5,
          planning: 4,
          blocked: 0,
        },
        risk_distribution: {
          low: 6,
          medium: 4,
          high: 2,
          critical: 0,
        },
        recent_projects: [
          {
            project_id: 'PRJ-001',
            project_name: 'Oracle to AWS RDS PostgreSQL',
            status: 'in_progress',
            progress: 65,
            risk_level: 'medium',
            target_date: '2026-07-15',
          },
          {
            project_id: 'PRJ-002',
            project_name: 'SQL Server to Azure SQL',
            status: 'planning',
            progress: 25,
            risk_level: 'low',
            target_date: '2026-08-01',
          },
          {
            project_id: 'PRJ-003',
            project_name: 'MongoDB to DocumentDB',
            status: 'ready',
            progress: 90,
            risk_level: 'low',
            target_date: '2026-06-30',
          },
        ],
        compatibility_scores: [
          { name: 'Oracle → PostgreSQL', score: 78 },
          { name: 'SQL Server → Azure SQL', score: 95 },
          { name: 'MySQL → Aurora', score: 88 },
          { name: 'MongoDB → DocumentDB', score: 92 },
        ],
        cloud_distribution: [
          { name: 'AWS', value: 8, color: '#FF9900' },
          { name: 'Azure', value: 3, color: '#0078D4' },
          { name: 'GCP', value: 1, color: '#4285F4' },
        ],
      };

      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      ready: 'success',
      in_progress: 'primary',
      planning: 'warning',
      blocked: 'error',
      completed: 'success',
    };
    return colors[status] || 'default';
  };

  const getRiskColor = (risk: string) => {
    const colors: any = {
      low: 'success',
      medium: 'warning',
      high: 'error',
      critical: 'error',
    };
    return colors[risk] || 'default';
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Migration Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of all migration projects and activities
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Storage sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {dashboardData.summary.total_projects}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Projects
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {dashboardData.summary.active_migrations}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Migrations
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {dashboardData.summary.completed_migrations}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CloudQueue sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {dashboardData.summary.total_data_migrated_tb} TB
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Data Migrated
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Migration Readiness */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Migration Readiness
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { status: 'Ready', count: dashboardData.migration_readiness.ready },
                    { status: 'In Progress', count: dashboardData.migration_readiness.in_progress },
                    { status: 'Planning', count: dashboardData.migration_readiness.planning },
                    { status: 'Blocked', count: dashboardData.migration_readiness.blocked },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Cloud Provider Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cloud Provider Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.cloud_distribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.cloud_distribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Compatibility Scores */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Compatibility Scores
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {dashboardData.compatibility_scores.map((item: any, index: number) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{item.name}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {item.score}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.score}
                        color={item.score >= 80 ? 'success' : item.score >= 60 ? 'warning' : 'error'}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Projects */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Projects
                </Typography>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/projects')}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Project Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Risk Level</TableCell>
                      <TableCell>Target Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recent_projects.map((project: any) => (
                      <TableRow key={project.project_id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {project.project_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {project.project_id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={project.status.replace('_', ' ').toUpperCase()}
                            color={getStatusColor(project.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ flexGrow: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={project.progress}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>
                            <Typography variant="body2">{project.progress}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={project.risk_level.toUpperCase()}
                            color={getRiskColor(project.risk_level)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Schedule fontSize="small" color="action" />
                            <Typography variant="body2">
                              {new Date(project.target_date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => navigate(`/projects/${project.project_id}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Risk Summary */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Distribution
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                    <Typography variant="h4" color="success.dark">
                      {dashboardData.risk_distribution.low}
                    </Typography>
                    <Typography variant="body2" color="success.dark">
                      Low Risk
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                    <Typography variant="h4" color="warning.dark">
                      {dashboardData.risk_distribution.medium}
                    </Typography>
                    <Typography variant="body2" color="warning.dark">
                      Medium Risk
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                    <Typography variant="h4" color="error.dark">
                      {dashboardData.risk_distribution.high}
                    </Typography>
                    <Typography variant="body2" color="error.dark">
                      High Risk
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.dark', borderRadius: 2 }}>
                    <Typography variant="h4" color="white">
                      {dashboardData.risk_distribution.critical}
                    </Typography>
                    <Typography variant="body2" color="white">
                      Critical Risk
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

// Made with Bob
