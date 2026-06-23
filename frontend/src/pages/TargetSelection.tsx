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
  CardActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Cloud as CloudIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const hyperscalers = [
  {
    id: 'aws',
    name: 'Amazon Web Services (AWS)',
    logo: '☁️',
    services: ['RDS', 'Aurora', 'DynamoDB', 'Redshift', 'DocumentDB'],
    features: [
      'Widest range of database services',
      'Global infrastructure',
      'Advanced automation tools',
      'AWS Database Migration Service',
    ],
    color: '#FF9900',
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    logo: '⚡',
    services: ['Azure SQL', 'Cosmos DB', 'PostgreSQL', 'MySQL', 'Synapse Analytics'],
    features: [
      'Hybrid cloud capabilities',
      'Enterprise integration',
      'Azure Database Migration Service',
      'Strong Windows/SQL Server support',
    ],
    color: '#0078D4',
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform (GCP)',
    logo: '🔷',
    services: ['Cloud SQL', 'Spanner', 'BigQuery', 'Firestore', 'Bigtable'],
    features: [
      'Advanced analytics and ML',
      'Global network',
      'Database Migration Service',
      'Strong open-source support',
    ],
    color: '#4285F4',
  },
];

const TargetSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedHyperscaler, setSelectedHyperscaler] = useState<string>('');
  const [sourceDatabases, setSourceDatabases] = useState<any[]>([]);

  useEffect(() => {
    // Load source databases from sessionStorage
    const stored = sessionStorage.getItem('sourceDatabases');
    if (stored) {
      setSourceDatabases(JSON.parse(stored));
    } else {
      // Redirect back if no source data
      navigate('/source-input');
    }
  }, [navigate]);

  const handleNext = () => {
    if (selectedHyperscaler) {
      sessionStorage.setItem('targetHyperscaler', selectedHyperscaler);
      navigate('/recommendations');
    }
  };

  const handleBack = () => {
    navigate('/source-input');
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloudIcon fontSize="large" color="primary" />
          Select Target Hyperscaler
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose your target cloud platform for migration
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={1}>
          <Step completed>
            <StepLabel>Source Discovery</StepLabel>
          </Step>
          <Step>
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

      {/* Source Summary */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          <strong>Your Source Databases:</strong>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {sourceDatabases.map((db, index) => (
            <Chip
              key={index}
              label={`${db.type} ${db.version} (${db.sizeGB}GB)`}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Alert>

      {/* Hyperscaler Selection */}
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          value={selectedHyperscaler}
          onChange={(e) => setSelectedHyperscaler(e.target.value)}
        >
          <Grid container spacing={3}>
            {hyperscalers.map((hyperscaler) => (
              <Grid item xs={12} md={4} key={hyperscaler.id}>
                <Card
                  sx={{
                    height: '100%',
                    border: 2,
                    borderColor:
                      selectedHyperscaler === hyperscaler.id
                        ? hyperscaler.color
                        : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: hyperscaler.color,
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => setSelectedHyperscaler(hyperscaler.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h2" sx={{ mr: 2 }}>
                        {hyperscaler.logo}
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{hyperscaler.name}</Typography>
                        <FormControlLabel
                          value={hyperscaler.id}
                          control={<Radio />}
                          label=""
                          sx={{ m: 0 }}
                        />
                      </Box>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      Available Services:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                      {hyperscaler.services.map((service) => (
                        <Chip key={service} label={service} size="small" />
                      ))}
                    </Box>

                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      Key Features:
                    </Typography>
                    <List dense>
                      {hyperscaler.features.map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>

      {/* Multi-Cloud Option */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          💡 Multi-Cloud Strategy
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Consider a multi-cloud approach for:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Avoiding vendor lock-in" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Leveraging best-of-breed services" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Geographic redundancy and disaster recovery" />
          </ListItem>
        </List>
      </Paper>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          disabled={!selectedHyperscaler}
        >
          Next: View Recommendations
        </Button>
      </Box>
    </Box>
  );
};

export default TargetSelection;

// Made with Bob
