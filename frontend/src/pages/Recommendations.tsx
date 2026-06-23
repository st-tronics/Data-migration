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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

interface Recommendation {
  sourceDb: string;
  sourceVersion: string;
  targetDb: string;
  targetVersion: string;
  migrationStrategy: string;
  compatibilityScore: number;
  estimatedEffort: string;
  risks: string[];
  benefits: string[];
  estimatedCost: string;
}

const Recommendations: React.FC = () => {
  const navigate = useNavigate();
  const [sourceDatabases, setSourceDatabases] = useState<any[]>([]);
  const [hyperscaler, setHyperscaler] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    // Load data from sessionStorage
    const storedSources = sessionStorage.getItem('sourceDatabases');
    const storedHyperscaler = sessionStorage.getItem('targetHyperscaler');

    if (!storedSources || !storedHyperscaler) {
      navigate('/source-input');
      return;
    }

    const sources = JSON.parse(storedSources);
    setSourceDatabases(sources);
    setHyperscaler(storedHyperscaler);

    // Generate recommendations
    const recs = generateRecommendations(sources, storedHyperscaler);
    setRecommendations(recs);
  }, [navigate]);

  const generateRecommendations = (sources: any[], hyperscaler: string): Recommendation[] => {
    return sources.map((source) => {
      const mapping = getTargetMapping(source.type, source.version, hyperscaler, source.workloadType);
      return {
        sourceDb: `${source.type} ${source.version}`,
        sourceVersion: source.version,
        targetDb: mapping.targetDb,
        targetVersion: mapping.targetVersion,
        migrationStrategy: mapping.strategy,
        compatibilityScore: mapping.compatibilityScore,
        estimatedEffort: mapping.effort,
        risks: mapping.risks,
        benefits: mapping.benefits,
        estimatedCost: calculateCost(source.sizeGB, mapping.targetDb),
      };
    });
  };

  const getTargetMapping = (sourceType: string, version: string, hyperscaler: string, workload: string) => {
    // AWS Mappings
    if (hyperscaler === 'aws') {
      if (sourceType === 'Oracle') {
        return {
          targetDb: 'Amazon Aurora PostgreSQL',
          targetVersion: '15.x',
          strategy: 'Replatform with Schema Conversion',
          compatibilityScore: 85,
          effort: '3-6 months',
          risks: ['PL/SQL to PL/pgSQL conversion', 'Oracle-specific features', 'Performance tuning needed'],
          benefits: ['60% cost reduction', 'Better scalability', 'Managed service', 'No licensing fees'],
        };
      } else if (sourceType === 'SQL Server') {
        return {
          targetDb: 'Amazon RDS for SQL Server',
          targetVersion: '2022',
          strategy: 'Rehost (Lift & Shift)',
          compatibilityScore: 95,
          effort: '1-2 months',
          risks: ['Minimal - high compatibility', 'Network latency considerations'],
          benefits: ['Managed backups', 'High availability', 'Automated patching', 'Easy scaling'],
        };
      } else if (sourceType === 'MySQL') {
        return {
          targetDb: 'Amazon Aurora MySQL',
          targetVersion: '8.0',
          strategy: 'Replatform',
          compatibilityScore: 98,
          effort: '1-3 months',
          risks: ['Minor syntax differences', 'Custom functions review'],
          benefits: ['5x performance improvement', '99.99% availability', 'Auto-scaling storage'],
        };
      } else if (sourceType === 'PostgreSQL') {
        return {
          targetDb: 'Amazon Aurora PostgreSQL',
          targetVersion: '15.x',
          strategy: 'Rehost',
          compatibilityScore: 99,
          effort: '2-4 weeks',
          risks: ['Minimal - near 100% compatibility'],
          benefits: ['3x performance', 'Managed service', 'Point-in-time recovery'],
        };
      } else if (sourceType === 'MongoDB') {
        return {
          targetDb: 'Amazon DocumentDB',
          targetVersion: '5.0',
          strategy: 'Replatform',
          compatibilityScore: 90,
          effort: '2-4 months',
          risks: ['Some MongoDB features not supported', 'API compatibility review needed'],
          benefits: ['Fully managed', 'MongoDB compatible', 'Automatic scaling'],
        };
      }
    }

    // Azure Mappings
    if (hyperscaler === 'azure') {
      if (sourceType === 'Oracle') {
        return {
          targetDb: 'Azure Database for PostgreSQL',
          targetVersion: '15',
          strategy: 'Replatform with Modernization',
          compatibilityScore: 82,
          effort: '4-8 months',
          risks: ['Complex PL/SQL migration', 'Oracle packages conversion', 'Testing overhead'],
          benefits: ['70% cost savings', 'Cloud-native features', 'Better integration with Azure services'],
        };
      } else if (sourceType === 'SQL Server') {
        return {
          targetDb: 'Azure SQL Database',
          targetVersion: 'Latest',
          strategy: 'Rehost to PaaS',
          compatibilityScore: 97,
          effort: '1-2 months',
          risks: ['Some SQL Server features not in PaaS', 'Connection string changes'],
          benefits: ['Seamless migration', 'Built-in HA', 'Intelligent performance', 'Automatic tuning'],
        };
      } else if (sourceType === 'MySQL') {
        return {
          targetDb: 'Azure Database for MySQL',
          targetVersion: '8.0',
          strategy: 'Replatform',
          compatibilityScore: 96,
          effort: '1-3 months',
          risks: ['Minor configuration differences', 'Extension compatibility'],
          benefits: ['Managed service', 'Built-in security', 'Automatic backups'],
        };
      } else if (sourceType === 'PostgreSQL') {
        return {
          targetDb: 'Azure Database for PostgreSQL',
          targetVersion: '15',
          strategy: 'Rehost',
          compatibilityScore: 98,
          effort: '2-4 weeks',
          risks: ['Minimal compatibility issues'],
          benefits: ['Hyperscale option', 'Intelligent performance', 'Advanced security'],
        };
      } else if (sourceType === 'MongoDB') {
        return {
          targetDb: 'Azure Cosmos DB (MongoDB API)',
          targetVersion: '4.2',
          strategy: 'Replatform',
          compatibilityScore: 88,
          effort: '2-5 months',
          risks: ['API version limitations', 'Query performance differences'],
          benefits: ['Global distribution', 'Multi-model support', 'Guaranteed SLAs'],
        };
      }
    }

    // GCP Mappings
    if (hyperscaler === 'gcp') {
      if (sourceType === 'Oracle') {
        return {
          targetDb: 'Cloud SQL for PostgreSQL',
          targetVersion: '15',
          strategy: 'Replatform',
          compatibilityScore: 83,
          effort: '3-7 months',
          risks: ['Oracle-specific features', 'PL/SQL conversion', 'Performance optimization'],
          benefits: ['Significant cost reduction', 'Google infrastructure', 'BigQuery integration'],
        };
      } else if (sourceType === 'SQL Server') {
        return {
          targetDb: 'Cloud SQL for SQL Server',
          targetVersion: '2022',
          strategy: 'Rehost',
          compatibilityScore: 94,
          effort: '1-3 months',
          risks: ['Some enterprise features limitations', 'Network configuration'],
          benefits: ['Managed service', 'Automatic replication', 'Easy scaling'],
        };
      } else if (sourceType === 'MySQL') {
        return {
          targetDb: 'Cloud SQL for MySQL',
          targetVersion: '8.0',
          strategy: 'Rehost',
          compatibilityScore: 97,
          effort: '1-2 months',
          risks: ['Minor configuration adjustments'],
          benefits: ['High performance', 'Automatic storage increase', 'Point-in-time recovery'],
        };
      } else if (sourceType === 'PostgreSQL') {
        return {
          targetDb: 'Cloud SQL for PostgreSQL',
          targetVersion: '15',
          strategy: 'Rehost',
          compatibilityScore: 99,
          effort: '2-4 weeks',
          risks: ['Minimal - excellent compatibility'],
          benefits: ['Managed service', 'High availability', 'Automatic backups'],
        };
      } else if (sourceType === 'MongoDB') {
        return {
          targetDb: 'Cloud Firestore',
          targetVersion: 'Latest',
          strategy: 'Refactor',
          compatibilityScore: 75,
          effort: '4-8 months',
          risks: ['Significant application changes', 'Data model redesign', 'Query rewrite'],
          benefits: ['Serverless', 'Real-time sync', 'Offline support', 'Auto-scaling'],
        };
      }
    }

    // Default fallback
    return {
      targetDb: 'Cloud-Native Database',
      targetVersion: 'Latest',
      strategy: 'Assess and Plan',
      compatibilityScore: 70,
      effort: '3-6 months',
      risks: ['Requires detailed assessment'],
      benefits: ['Cloud-native features', 'Managed service'],
    };
  };

  const calculateCost = (sizeGB: number, targetDb: string): string => {
    const baseRate = 0.15; // per GB per month
    const multiplier = targetDb.includes('Aurora') || targetDb.includes('Spanner') ? 1.5 : 1.0;
    const monthlyCost = sizeGB * baseRate * multiplier;
    return `$${monthlyCost.toFixed(2)}/month (estimated)`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'warning';
    return 'error';
  };

  const handleNext = () => {
    sessionStorage.setItem('recommendations', JSON.stringify(recommendations));
    navigate('/migration-plan');
  };

  const handleBack = () => {
    navigate('/target-selection');
  };

  const hyperscalerNames: Record<string, string> = {
    aws: 'Amazon Web Services (AWS)',
    azure: 'Microsoft Azure',
    gcp: 'Google Cloud Platform (GCP)',
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon fontSize="large" color="primary" />
          Migration Recommendations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered recommendations for your database migration to {hyperscalerNames[hyperscaler]}
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={2}>
          <Step completed>
            <StepLabel>Source Discovery</StepLabel>
          </Step>
          <Step completed>
            <StepLabel>Target Selection</StepLabel>
          </Step>
          <Step>
            <StepLabel>Recommendations</StepLabel>
          </Step>
          <Step>
            <StepLabel>Migration Plan</StepLabel>
          </Step>
        </Stepper>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Databases
              </Typography>
              <Typography variant="h3">{recommendations.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Avg Compatibility
              </Typography>
              <Typography variant="h3">
                {recommendations.length > 0
                  ? Math.round(
                      recommendations.reduce((sum, r) => sum + r.compatibilityScore, 0) /
                        recommendations.length
                    )
                  : 0}
                %
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Est. Total Cost
              </Typography>
              <Typography variant="h3">
                $
                {recommendations
                  .reduce((sum, r) => sum + parseFloat(r.estimatedCost.match(/\d+\.?\d*/)?.[0] || '0'), 0)
                  .toFixed(0)}
                /mo
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Migration Strategies
              </Typography>
              <Typography variant="h3">
                {new Set(recommendations.map((r) => r.migrationStrategy)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recommendations Table */}
      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Source Database</strong></TableCell>
                <TableCell><strong>Target Database</strong></TableCell>
                <TableCell><strong>Strategy</strong></TableCell>
                <TableCell><strong>Compatibility</strong></TableCell>
                <TableCell><strong>Effort</strong></TableCell>
                <TableCell><strong>Est. Cost</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recommendations.map((rec, index) => (
                <TableRow key={index}>
                  <TableCell>{rec.sourceDb}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {rec.targetDb}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Version {rec.targetVersion}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={rec.migrationStrategy} size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${rec.compatibilityScore}%`}
                      size="small"
                      color={getScoreColor(rec.compatibilityScore)}
                    />
                  </TableCell>
                  <TableCell>{rec.estimatedEffort}</TableCell>
                  <TableCell>{rec.estimatedCost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Detailed Recommendations */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Detailed Analysis
      </Typography>
      {recommendations.map((rec, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {rec.sourceDb} → {rec.targetDb}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom color="error">
                  <WarningIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Risks & Challenges
                </Typography>
                <List dense>
                  {rec.risks.map((risk, i) => (
                    <ListItem key={i}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <WarningIcon fontSize="small" color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={risk} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom color="success.main">
                  <CheckCircleIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Benefits
                </Typography>
                <List dense>
                  {rec.benefits.map((benefit, i) => (
                    <ListItem key={i}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Alert severity="info" icon={<InfoIcon />}>
              <Typography variant="body2">
                <strong>Recommendation:</strong> {rec.migrationStrategy} is the optimal approach for this
                migration with a {rec.compatibilityScore}% compatibility score. Estimated timeline:{' '}
                {rec.estimatedEffort}.
              </Typography>
            </Alert>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext}>
          Next: Generate Migration Plan
        </Button>
      </Box>
    </Box>
  );
};

export default Recommendations;

// Made with Bob
