import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Assessment as AssessmentIcon,
  Build as BuildIcon,
  CloudUpload as CloudUploadIcon,
  VerifiedUser as VerifiedUserIcon,
  Rocket as RocketIcon,
} from '@mui/icons-material';

interface MigrationPhase {
  name: string;
  duration: string;
  tasks: string[];
  deliverables: string[];
  icon: React.ReactNode;
  color: string;
}

const MigrationPlan: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [hyperscaler, setHyperscaler] = useState<string>('');
  const [phases, setPhases] = useState<MigrationPhase[]>([]);

  useEffect(() => {
    const storedRecs = sessionStorage.getItem('recommendations');
    const storedHyperscaler = sessionStorage.getItem('targetHyperscaler');

    if (!storedRecs || !storedHyperscaler) {
      navigate('/source-input');
      return;
    }

    const recs = JSON.parse(storedRecs);
    setRecommendations(recs);
    setHyperscaler(storedHyperscaler);
    setPhases(generateMigrationPhases(recs, storedHyperscaler));
  }, [navigate]);

  const generateMigrationPhases = (recs: any[], hyperscaler: string): MigrationPhase[] => {
    return [
      {
        name: 'Assessment & Planning',
        duration: '2-4 weeks',
        tasks: [
          'Detailed source database assessment',
          'Application dependency mapping',
          'Performance baseline establishment',
          'Risk assessment and mitigation planning',
          'Team training and skill gap analysis',
          'Migration tooling selection',
        ],
        deliverables: [
          'Migration assessment report',
          'Detailed project plan',
          'Risk register',
          'Resource allocation plan',
        ],
        icon: <AssessmentIcon />,
        color: '#2196F3',
      },
      {
        name: 'Environment Setup',
        duration: '1-2 weeks',
        tasks: [
          `Provision ${hyperscaler.toUpperCase()} infrastructure`,
          'Configure networking and security',
          'Set up monitoring and logging',
          'Establish backup and recovery procedures',
          'Configure CI/CD pipelines',
          'Set up test environments',
        ],
        deliverables: [
          'Target environment documentation',
          'Network architecture diagram',
          'Security configuration guide',
          'Monitoring dashboard',
        ],
        icon: <BuildIcon />,
        color: '#FF9800',
      },
      {
        name: 'Schema Migration',
        duration: '2-6 weeks',
        tasks: [
          'Schema conversion and optimization',
          'Data type mapping',
          'Index and constraint migration',
          'Stored procedure conversion',
          'View and trigger migration',
          'Schema validation',
        ],
        deliverables: [
          'Converted schema scripts',
          'Schema comparison report',
          'Conversion documentation',
          'Rollback scripts',
        ],
        icon: <CloudUploadIcon />,
        color: '#4CAF50',
      },
      {
        name: 'Data Migration',
        duration: '1-4 weeks',
        tasks: [
          'Initial data load',
          'Incremental data sync',
          'Data validation and reconciliation',
          'Performance optimization',
          'Data integrity checks',
          'Migration cutover rehearsal',
        ],
        deliverables: [
          'Data migration scripts',
          'Validation reports',
          'Performance benchmarks',
          'Cutover runbook',
        ],
        icon: <CloudUploadIcon />,
        color: '#9C27B0',
      },
      {
        name: 'Application Migration',
        duration: '3-8 weeks',
        tasks: [
          'Application code updates',
          'Connection string modifications',
          'Query optimization',
          'Integration testing',
          'Performance testing',
          'User acceptance testing',
        ],
        deliverables: [
          'Updated application code',
          'Test results documentation',
          'Performance test reports',
          'UAT sign-off',
        ],
        icon: <PlayArrowIcon />,
        color: '#F44336',
      },
      {
        name: 'Validation & Testing',
        duration: '2-4 weeks',
        tasks: [
          'Functional testing',
          'Performance testing',
          'Security testing',
          'Disaster recovery testing',
          'Load testing',
          'Final data validation',
        ],
        deliverables: [
          'Test execution reports',
          'Performance comparison',
          'Security audit report',
          'Go-live checklist',
        ],
        icon: <VerifiedUserIcon />,
        color: '#00BCD4',
      },
      {
        name: 'Cutover & Go-Live',
        duration: '1-2 weeks',
        tasks: [
          'Final data synchronization',
          'Application cutover',
          'DNS/traffic switching',
          'Post-migration validation',
          'Performance monitoring',
          'Hypercare support',
        ],
        deliverables: [
          'Cutover execution report',
          'Post-migration validation report',
          'Lessons learned document',
          'Handover documentation',
        ],
        icon: <RocketIcon />,
        color: '#8BC34A',
      },
    ];
  };

  const getTotalDuration = () => {
    const weeks = phases.reduce((total, phase) => {
      const match = phase.duration.match(/(\d+)-(\d+)/);
      if (match) {
        return total + parseInt(match[2]);
      }
      return total;
    }, 0);
    return `${Math.floor(weeks / 4)}-${Math.ceil(weeks / 4)} months`;
  };

  const handleDownload = () => {
    const content = generatePlanDocument();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'migration-plan.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePlanDocument = () => {
    let doc = '='.repeat(80) + '\n';
    doc += 'DATABASE MIGRATION PLAN\n';
    doc += '='.repeat(80) + '\n\n';
    doc += `Target Platform: ${hyperscaler.toUpperCase()}\n`;
    doc += `Total Duration: ${getTotalDuration()}\n`;
    doc += `Number of Databases: ${recommendations.length}\n\n`;

    doc += 'SOURCE TO TARGET MAPPING\n';
    doc += '-'.repeat(80) + '\n';
    recommendations.forEach((rec, i) => {
      doc += `${i + 1}. ${rec.sourceDb} → ${rec.targetDb}\n`;
      doc += `   Strategy: ${rec.migrationStrategy}\n`;
      doc += `   Compatibility: ${rec.compatibilityScore}%\n`;
      doc += `   Estimated Effort: ${rec.estimatedEffort}\n\n`;
    });

    doc += '\nMIGRATION PHASES\n';
    doc += '-'.repeat(80) + '\n';
    phases.forEach((phase, i) => {
      doc += `\nPhase ${i + 1}: ${phase.name} (${phase.duration})\n`;
      doc += 'Tasks:\n';
      phase.tasks.forEach((task) => {
        doc += `  - ${task}\n`;
      });
      doc += 'Deliverables:\n';
      phase.deliverables.forEach((del) => {
        doc += `  - ${del}\n`;
      });
    });

    return doc;
  };

  const handleBack = () => {
    navigate('/recommendations');
  };

  const handleStartOver = () => {
    sessionStorage.clear();
    navigate('/source-input');
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RocketIcon fontSize="large" color="primary" />
          Migration Delivery Plan
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive end-to-end migration plan with timelines and deliverables
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={3}>
          <Step completed>
            <StepLabel>Source Discovery</StepLabel>
          </Step>
          <Step completed>
            <StepLabel>Target Selection</StepLabel>
          </Step>
          <Step completed>
            <StepLabel>Recommendations</StepLabel>
          </Step>
          <Step>
            <StepLabel>Migration Plan</StepLabel>
          </Step>
        </Stepper>
      </Paper>

      {/* Success Alert */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Migration plan generated successfully!</strong> Review the detailed plan below and download
          for your records.
        </Typography>
      </Alert>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Duration
              </Typography>
              <Typography variant="h4">{getTotalDuration()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Migration Phases
              </Typography>
              <Typography variant="h4">{phases.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Databases
              </Typography>
              <Typography variant="h4">{recommendations.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Target Platform
              </Typography>
              <Typography variant="h4">{hyperscaler.toUpperCase()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Migration Timeline */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Migration Timeline
        </Typography>
        <Timeline position="alternate">
          {phases.map((phase, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent color="text.secondary">
                {phase.duration}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: phase.color }}>{phase.icon}</TimelineDot>
                {index < phases.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6">{phase.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {phase.tasks.length} tasks, {phase.deliverables.length} deliverables
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Paper>

      {/* Database Mappings */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Source to Target Mappings
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Source</strong></TableCell>
                <TableCell><strong>Target</strong></TableCell>
                <TableCell><strong>Strategy</strong></TableCell>
                <TableCell><strong>Effort</strong></TableCell>
                <TableCell><strong>Cost</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recommendations.map((rec, index) => (
                <TableRow key={index}>
                  <TableCell>{rec.sourceDb}</TableCell>
                  <TableCell>{rec.targetDb}</TableCell>
                  <TableCell>
                    <Chip label={rec.migrationStrategy} size="small" />
                  </TableCell>
                  <TableCell>{rec.estimatedEffort}</TableCell>
                  <TableCell>{rec.estimatedCost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Detailed Phase Breakdown */}
      <Typography variant="h6" gutterBottom>
        Detailed Phase Breakdown
      </Typography>
      {phases.map((phase, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Box sx={{ color: phase.color }}>{phase.icon}</Box>
              <Typography sx={{ flex: 1 }}>
                Phase {index + 1}: {phase.name}
              </Typography>
              <Chip label={phase.duration} size="small" />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Tasks
                </Typography>
                <List dense>
                  {phase.tasks.map((task, i) => (
                    <ListItem key={i}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText primary={task} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom color="success.main">
                  Deliverables
                </Typography>
                <List dense>
                  {phase.deliverables.map((deliverable, i) => (
                    <ListItem key={i}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary={deliverable} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Key Recommendations */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.50' }}>
        <Typography variant="h6" gutterBottom>
          Key Recommendations
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Start with a pilot migration"
              secondary="Begin with a non-critical database to validate the process"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Implement comprehensive monitoring"
              secondary="Set up monitoring before migration to track performance and issues"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Plan for rollback"
              secondary="Always have a tested rollback plan in case of issues"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Conduct thorough testing"
              secondary="Test all scenarios including edge cases and failure modes"
            />
          </ListItem>
        </List>
      </Paper>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={handleStartOver}>
            Start New Assessment
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownload}>
            Download Plan
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MigrationPlan;

// Made with Bob
