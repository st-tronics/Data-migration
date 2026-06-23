import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

interface DatabaseSource {
  id: string;
  type: string;
  version: string;
  edition: string;
  sizeGB: number;
  workloadType: string;
  environment: string;
  compliance: string[];
}

const databaseTypes = [
  'Oracle',
  'SQL Server',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'DB2',
  'Sybase',
  'Informix',
  'MariaDB',
  'Cassandra',
];

const workloadTypes = ['OLTP', 'OLAP', 'Mixed', 'Data Warehouse', 'Real-time Analytics'];
const environments = ['On-Premises', 'Private Cloud', 'VM', 'Container', 'Mainframe'];
const complianceOptions = ['GDPR', 'HIPAA', 'PCI-DSS', 'SOC 2', 'ISO 27001', 'None'];

const SourceInput: React.FC = () => {
  const navigate = useNavigate();
  const [databases, setDatabases] = useState<DatabaseSource[]>([
    {
      id: '1',
      type: '',
      version: '',
      edition: '',
      sizeGB: 0,
      workloadType: '',
      environment: '',
      compliance: [],
    },
  ]);

  const addDatabase = () => {
    setDatabases([
      ...databases,
      {
        id: Date.now().toString(),
        type: '',
        version: '',
        edition: '',
        sizeGB: 0,
        workloadType: '',
        environment: '',
        compliance: [],
      },
    ]);
  };

  const removeDatabase = (id: string) => {
    if (databases.length > 1) {
      setDatabases(databases.filter((db) => db.id !== id));
    }
  };

  const updateDatabase = (id: string, field: keyof DatabaseSource, value: any) => {
    setDatabases(
      databases.map((db) => (db.id === id ? { ...db, [field]: value } : db))
    );
  };

  const handleNext = () => {
    // Store data in sessionStorage
    sessionStorage.setItem('sourceDatabases', JSON.stringify(databases));
    navigate('/target-selection');
  };

  const isValid = databases.every(
    (db) => db.type && db.version && db.sizeGB > 0 && db.workloadType && db.environment
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StorageIcon fontSize="large" color="primary" />
          Source Database Discovery
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter details about your source databases to get migration recommendations
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={0}>
          <Step>
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

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Add all your source databases below. The tool will analyze them and recommend the best target
        databases on your chosen hyperscaler.
      </Alert>

      {/* Database Forms */}
      {databases.map((db, index) => (
        <Card key={db.id} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Database #{index + 1}
              </Typography>
              {databases.length > 1 && (
                <IconButton color="error" onClick={() => removeDatabase(db.id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={3}>
              {/* Database Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Database Type</InputLabel>
                  <Select
                    value={db.type}
                    label="Database Type"
                    onChange={(e) => updateDatabase(db.id, 'type', e.target.value)}
                  >
                    {databaseTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Version */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Version"
                  placeholder="e.g., 19c, 2019, 8.0"
                  value={db.version}
                  onChange={(e) => updateDatabase(db.id, 'version', e.target.value)}
                />
              </Grid>

              {/* Edition */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Edition"
                  placeholder="e.g., Enterprise, Standard"
                  value={db.edition}
                  onChange={(e) => updateDatabase(db.id, 'edition', e.target.value)}
                />
              </Grid>

              {/* Size */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Database Size (GB)"
                  value={db.sizeGB || ''}
                  onChange={(e) => updateDatabase(db.id, 'sizeGB', parseFloat(e.target.value) || 0)}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              {/* Workload Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Workload Type</InputLabel>
                  <Select
                    value={db.workloadType}
                    label="Workload Type"
                    onChange={(e) => updateDatabase(db.id, 'workloadType', e.target.value)}
                  >
                    {workloadTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Environment */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Current Environment</InputLabel>
                  <Select
                    value={db.environment}
                    label="Current Environment"
                    onChange={(e) => updateDatabase(db.id, 'environment', e.target.value)}
                  >
                    {environments.map((env) => (
                      <MenuItem key={env} value={env}>
                        {env}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Compliance */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Compliance Requirements</InputLabel>
                  <Select
                    multiple
                    value={db.compliance}
                    label="Compliance Requirements"
                    onChange={(e) => updateDatabase(db.id, 'compliance', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {complianceOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      {/* Add Database Button */}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addDatabase}
        sx={{ mb: 3 }}
        fullWidth
      >
        Add Another Database
      </Button>

      {/* Summary */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Total Databases
            </Typography>
            <Typography variant="h4">{databases.length}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Total Size
            </Typography>
            <Typography variant="h4">
              {databases.reduce((sum, db) => sum + db.sizeGB, 0)} GB
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Database Types
            </Typography>
            <Typography variant="h4">
              {new Set(databases.map((db) => db.type).filter(Boolean)).size}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Compliance Needs
            </Typography>
            <Typography variant="h4">
              {new Set(databases.flatMap((db) => db.compliance)).size}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          disabled={!isValid}
        >
          Next: Select Target
        </Button>
      </Box>
    </Box>
  );
};

export default SourceInput;

// Made with Bob
