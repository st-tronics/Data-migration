import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

/**
 * Netlify Serverless Function - Mock API for Demo
 * Provides mock data for the frontend demo without requiring a full backend
 */

// Mock data store
const mockData = {
  projects: [
    {
      project_id: 'PRJ-001',
      project_name: 'Oracle to AWS RDS PostgreSQL',
      project_code: 'ORA-AWS-001',
      status: 'in_progress',
      priority: 'high',
      progress: 65,
      risk_level: 'medium',
      owner: 'John Doe',
      start_date: '2026-05-01',
      target_completion_date: '2026-07-15',
      source_count: 3,
      target_count: 2,
      compatibility_score: 78,
    },
    {
      project_id: 'PRJ-002',
      project_name: 'SQL Server to Azure SQL',
      project_code: 'SQL-AZ-001',
      status: 'planning',
      priority: 'medium',
      progress: 25,
      risk_level: 'low',
      owner: 'Jane Smith',
      start_date: '2026-06-15',
      target_completion_date: '2026-08-01',
      source_count: 2,
      target_count: 1,
      compatibility_score: 95,
    },
    {
      project_id: 'PRJ-003',
      project_name: 'MongoDB to DocumentDB',
      project_code: 'MONGO-AWS-001',
      status: 'ready',
      priority: 'high',
      progress: 90,
      risk_level: 'low',
      owner: 'Bob Johnson',
      start_date: '2026-05-20',
      target_completion_date: '2026-06-30',
      source_count: 1,
      target_count: 1,
      compatibility_score: 92,
    },
  ],
  
  dashboard: {
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
  },

  sources: [
    {
      source_id: 'SRC-001',
      project_id: 'PRJ-001',
      system_name: 'Production Oracle DB',
      system_type: 'Oracle',
      system_version: '12.2.0.1',
      database_size_gb: 2560,
      workload_type: 'OLTP',
      discovery_status: 'completed',
      compatibility_score: 78,
    },
    {
      source_id: 'SRC-002',
      project_id: 'PRJ-002',
      system_name: 'SQL Server Production',
      system_type: 'SQL Server',
      system_version: '2019',
      database_size_gb: 850,
      workload_type: 'OLTP',
      discovery_status: 'completed',
      compatibility_score: 95,
    },
  ],

  mappings: [
    {
      mapping_id: 'MAP-001',
      project_id: 'PRJ-001',
      source_id: 'SRC-001',
      target_id: 'TGT-001',
      compatibility_score: 78,
      compatibility_status: 'partial',
      overall_risk_score: 42,
      migration_pattern: 'replatform',
      estimated_duration_days: 47,
    },
  ],

  plans: [
    {
      plan_id: 'PLAN-001',
      project_id: 'PRJ-001',
      plan_name: 'Oracle to PostgreSQL Migration Plan',
      plan_version: '1.0',
      plan_status: 'approved',
      total_phases: 7,
      estimated_duration_days: 47,
    },
  ],
};

// API Router
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const path = event.path.replace('/.netlify/functions/api', '');
  const method = event.httpMethod;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS
  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Route handling
    if (path === '/dashboard' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mockData.dashboard),
      };
    }

    if (path === '/projects' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mockData.projects),
      };
    }

    if (path.startsWith('/projects/') && method === 'GET') {
      const projectId = path.split('/')[2];
      const project = mockData.projects.find(p => p.project_id === projectId);
      
      if (project) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(project),
        };
      }
    }

    if (path === '/sources' && method === 'GET') {
      const projectId = event.queryStringParameters?.project_id;
      const sources = projectId 
        ? mockData.sources.filter(s => s.project_id === projectId)
        : mockData.sources;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(sources),
      };
    }

    if (path === '/mappings' && method === 'GET') {
      const projectId = event.queryStringParameters?.project_id;
      const mappings = projectId 
        ? mockData.mappings.filter(m => m.project_id === projectId)
        : mockData.mappings;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mappings),
      };
    }

    if (path === '/plans' && method === 'GET') {
      const projectId = event.queryStringParameters?.project_id;
      const plans = projectId 
        ? mockData.plans.filter(p => p.project_id === projectId)
        : mockData.plans;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(plans),
      };
    }

    // POST endpoints (mock responses)
    if (path === '/projects' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const newProject = {
        project_id: `PRJ-${Date.now()}`,
        ...body,
        status: 'planning',
        progress: 0,
      };
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newProject),
      };
    }

    if (path === '/sources' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const newSource = {
        source_id: `SRC-${Date.now()}`,
        ...body,
        discovery_status: 'pending',
      };
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newSource),
      };
    }

    if (path.includes('/mappings/generate') && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const newMapping = {
        mapping_id: `MAP-${Date.now()}`,
        ...body,
        compatibility_score: 85,
        compatibility_status: 'compatible',
        overall_risk_score: 25,
        migration_pattern: 'replatform',
        estimated_duration_days: 30,
      };
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newMapping),
      };
    }

    if (path.includes('/plans/generate') && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const newPlan = {
        plan_id: `PLAN-${Date.now()}`,
        ...body,
        plan_version: '1.0',
        plan_status: 'draft',
        total_phases: 7,
      };
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newPlan),
      };
    }

    // 404 for unknown routes
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ 
        error: 'Not Found',
        message: `Route ${path} not found`,
      }),
    };

  } catch (error: any) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message,
      }),
    };
  }
};

export { handler };

// Made with Bob
