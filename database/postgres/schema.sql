-- ============================================================================
-- Data Migration Tool - PostgreSQL Schema
-- Metadata Repository for Source Systems, Targets, and Migration Plans
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TENANT MANAGEMENT
-- ============================================================================

CREATE TABLE tenants (
    tenant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_name VARCHAR(255) NOT NULL UNIQUE,
    tenant_code VARCHAR(50) NOT NULL UNIQUE,
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'standard',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    max_users INTEGER DEFAULT 100,
    max_projects INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_code ON tenants(tenant_code);

-- ============================================================================
-- USER MANAGEMENT
-- ============================================================================

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    preferences JSONB,
    UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- PROJECT MANAGEMENT
-- ============================================================================

CREATE TABLE projects (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    project_code VARCHAR(50) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(user_id),
    status VARCHAR(50) NOT NULL DEFAULT 'planning',
    priority VARCHAR(50) DEFAULT 'medium',
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    UNIQUE(tenant_id, project_code)
);

CREATE INDEX idx_projects_tenant ON projects(tenant_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_owner ON projects(owner_id);

-- ============================================================================
-- SOURCE SYSTEM DISCOVERY
-- ============================================================================

CREATE TABLE source_systems (
    source_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    
    -- Basic Information
    system_name VARCHAR(255) NOT NULL,
    system_type VARCHAR(100) NOT NULL, -- Oracle, SQL Server, PostgreSQL, MySQL, MongoDB, etc.
    system_version VARCHAR(100),
    system_edition VARCHAR(100),
    
    -- Hosting Environment
    hosting_type VARCHAR(100) NOT NULL, -- on-premises, private-cloud, mainframe, vm, container
    location VARCHAR(255),
    
    -- Database Characteristics
    database_size_gb DECIMAL(15,2),
    workload_type VARCHAR(50), -- OLTP, OLAP, Mixed
    data_type VARCHAR(50), -- structured, semi-structured, unstructured
    
    -- Performance Metrics
    avg_iops INTEGER,
    peak_iops INTEGER,
    avg_latency_ms DECIMAL(10,2),
    avg_throughput_mbps DECIMAL(10,2),
    
    -- Compliance & Regulatory
    compliance_requirements TEXT[], -- GDPR, HIPAA, PCI-DSS, SOC2, etc.
    data_classification VARCHAR(50), -- public, internal, confidential, restricted
    
    -- Technical Details
    schema_count INTEGER,
    table_count INTEGER,
    stored_procedure_count INTEGER,
    view_count INTEGER,
    index_count INTEGER,
    
    -- Connection Information (encrypted)
    connection_string TEXT,
    credentials_vault_id VARCHAR(255),
    
    -- Discovery Status
    discovery_status VARCHAR(50) DEFAULT 'pending',
    discovery_date TIMESTAMP WITH TIME ZONE,
    last_profiled_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Extended metadata
    technical_metadata JSONB,
    business_metadata JSONB
);

CREATE INDEX idx_source_systems_project ON source_systems(project_id);
CREATE INDEX idx_source_systems_tenant ON source_systems(tenant_id);
CREATE INDEX idx_source_systems_type ON source_systems(system_type);
CREATE INDEX idx_source_systems_status ON source_systems(discovery_status);

-- ============================================================================
-- SOURCE SYSTEM DEPENDENCIES
-- ============================================================================

CREATE TABLE source_dependencies (
    dependency_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES source_systems(source_id) ON DELETE CASCADE,
    dependent_source_id UUID REFERENCES source_systems(source_id) ON DELETE CASCADE,
    dependency_type VARCHAR(50) NOT NULL, -- replication, integration, reference, etc.
    description TEXT,
    criticality VARCHAR(50), -- low, medium, high, critical
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_source_dependencies_source ON source_dependencies(source_id);

-- ============================================================================
-- TARGET PLATFORM CONFIGURATION
-- ============================================================================

CREATE TABLE target_platforms (
    target_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    
    -- Cloud Provider
    cloud_provider VARCHAR(50) NOT NULL, -- AWS, Azure, GCP
    cloud_region VARCHAR(100),
    
    -- Target Service
    target_service VARCHAR(100) NOT NULL, -- RDS, Aurora, Azure SQL, Cloud SQL, etc.
    target_engine VARCHAR(100), -- PostgreSQL, MySQL, SQL Server, etc.
    target_version VARCHAR(50),
    
    -- Deployment Configuration
    deployment_type VARCHAR(50), -- single-az, multi-az, serverless
    instance_type VARCHAR(100),
    storage_type VARCHAR(50),
    storage_size_gb INTEGER,
    
    -- Scalability Requirements
    min_capacity INTEGER,
    max_capacity INTEGER,
    auto_scaling_enabled BOOLEAN DEFAULT false,
    
    -- High Availability & Disaster Recovery
    ha_enabled BOOLEAN DEFAULT false,
    dr_enabled BOOLEAN DEFAULT false,
    backup_retention_days INTEGER DEFAULT 7,
    
    -- Performance Requirements
    required_iops INTEGER,
    required_throughput_mbps DECIMAL(10,2),
    max_latency_ms DECIMAL(10,2),
    
    -- Cost Constraints
    monthly_budget_usd DECIMAL(15,2),
    cost_optimization_priority VARCHAR(50), -- performance, balanced, cost
    
    -- Compliance
    compliance_requirements TEXT[],
    encryption_at_rest BOOLEAN DEFAULT true,
    encryption_in_transit BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    configuration_metadata JSONB
);

CREATE INDEX idx_target_platforms_project ON target_platforms(project_id);
CREATE INDEX idx_target_platforms_tenant ON target_platforms(tenant_id);
CREATE INDEX idx_target_platforms_provider ON target_platforms(cloud_provider);

-- ============================================================================
-- SOURCE-TO-TARGET MAPPING
-- ============================================================================

CREATE TABLE migration_mappings (
    mapping_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES source_systems(source_id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES target_platforms(target_id) ON DELETE CASCADE,
    
    -- Mapping Strategy
    migration_pattern VARCHAR(50) NOT NULL, -- rehost, replatform, refactor
    migration_approach VARCHAR(50), -- online, offline, hybrid
    migration_type VARCHAR(50), -- big-bang, phased, parallel
    
    -- Compatibility Analysis
    compatibility_score DECIMAL(5,2), -- 0-100
    compatibility_status VARCHAR(50), -- compatible, partial, incompatible
    
    -- Risk Assessment
    overall_risk_score DECIMAL(5,2), -- 0-100
    compatibility_risk VARCHAR(50), -- low, medium, high, critical
    performance_risk VARCHAR(50),
    data_loss_risk VARCHAR(50),
    complexity_risk VARCHAR(50),
    
    -- Transformation Requirements
    schema_changes_required BOOLEAN DEFAULT false,
    data_type_conversions_required BOOLEAN DEFAULT false,
    code_refactoring_required BOOLEAN DEFAULT false,
    
    -- Estimated Effort
    estimated_duration_days INTEGER,
    estimated_complexity VARCHAR(50), -- simple, moderate, complex, very-complex
    
    -- Tooling Recommendations
    recommended_tools TEXT[],
    
    -- Validation Strategy
    validation_approach TEXT,
    reconciliation_strategy TEXT,
    
    -- Status
    mapping_status VARCHAR(50) DEFAULT 'draft',
    approved_by UUID REFERENCES users(user_id),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Detailed Analysis
    compatibility_details JSONB,
    risk_details JSONB,
    transformation_rules JSONB
);

CREATE INDEX idx_migration_mappings_project ON migration_mappings(project_id);
CREATE INDEX idx_migration_mappings_source ON migration_mappings(source_id);
CREATE INDEX idx_migration_mappings_target ON migration_mappings(target_id);
CREATE INDEX idx_migration_mappings_status ON migration_mappings(mapping_status);

-- ============================================================================
-- SCHEMA MAPPING DETAILS
-- ============================================================================

CREATE TABLE schema_mappings (
    schema_mapping_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mapping_id UUID NOT NULL REFERENCES migration_mappings(mapping_id) ON DELETE CASCADE,
    
    source_schema_name VARCHAR(255),
    target_schema_name VARCHAR(255),
    
    source_table_name VARCHAR(255),
    target_table_name VARCHAR(255),
    
    mapping_type VARCHAR(50), -- direct, transformed, split, merged
    transformation_logic TEXT,
    
    row_count BIGINT,
    estimated_migration_time_minutes INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    column_mappings JSONB,
    constraints_mapping JSONB,
    indexes_mapping JSONB
);

CREATE INDEX idx_schema_mappings_mapping ON schema_mappings(mapping_id);

-- ============================================================================
-- MIGRATION PLANS
-- ============================================================================

CREATE TABLE migration_plans (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    mapping_id UUID NOT NULL REFERENCES migration_mappings(mapping_id) ON DELETE CASCADE,
    
    plan_name VARCHAR(255) NOT NULL,
    plan_version VARCHAR(50) DEFAULT '1.0',
    
    -- Timeline
    planned_start_date TIMESTAMP WITH TIME ZONE,
    planned_end_date TIMESTAMP WITH TIME ZONE,
    cutover_window_start TIMESTAMP WITH TIME ZONE,
    cutover_window_end TIMESTAMP WITH TIME ZONE,
    
    -- Phases
    total_phases INTEGER,
    current_phase INTEGER DEFAULT 1,
    
    -- Resources
    team_size INTEGER,
    estimated_effort_hours DECIMAL(10,2),
    
    -- Status
    plan_status VARCHAR(50) DEFAULT 'draft',
    approval_status VARCHAR(50) DEFAULT 'pending',
    approved_by UUID REFERENCES users(user_id),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Detailed Plan
    execution_steps JSONB,
    rollback_plan JSONB,
    validation_plan JSONB,
    communication_plan JSONB,
    risk_mitigation_plan JSONB
);

CREATE INDEX idx_migration_plans_project ON migration_plans(project_id);
CREATE INDEX idx_migration_plans_mapping ON migration_plans(mapping_id);
CREATE INDEX idx_migration_plans_status ON migration_plans(plan_status);

-- ============================================================================
-- MIGRATION EXECUTION TRACKING
-- ============================================================================

CREATE TABLE migration_executions (
    execution_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES migration_plans(plan_id) ON DELETE CASCADE,
    
    execution_name VARCHAR(255),
    execution_type VARCHAR(50), -- test, pilot, production
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    
    -- Status
    execution_status VARCHAR(50) DEFAULT 'pending',
    success_rate DECIMAL(5,2),
    
    -- Metrics
    rows_migrated BIGINT,
    data_volume_gb DECIMAL(15,2),
    errors_count INTEGER DEFAULT 0,
    warnings_count INTEGER DEFAULT 0,
    
    -- Validation Results
    validation_status VARCHAR(50),
    validation_passed BOOLEAN,
    reconciliation_status VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    execution_logs JSONB,
    validation_results JSONB,
    performance_metrics JSONB
);

CREATE INDEX idx_migration_executions_plan ON migration_executions(plan_id);
CREATE INDEX idx_migration_executions_status ON migration_executions(execution_status);
CREATE INDEX idx_migration_executions_started ON migration_executions(started_at);

-- ============================================================================
-- AUDIT LOG
-- ============================================================================

CREATE TABLE audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id),
    
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    
    ip_address INET,
    user_agent TEXT,
    
    changes JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- ============================================================================
-- REPORTS
-- ============================================================================

CREATE TABLE reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    
    report_type VARCHAR(100) NOT NULL,
    report_name VARCHAR(255) NOT NULL,
    report_format VARCHAR(50), -- PDF, Excel, JSON
    
    generated_by UUID REFERENCES users(user_id),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    file_path TEXT,
    file_size_bytes BIGINT,
    
    report_parameters JSONB,
    report_data JSONB
);

CREATE INDEX idx_reports_project ON reports(project_id);
CREATE INDEX idx_reports_tenant ON reports(tenant_id);
CREATE INDEX idx_reports_type ON reports(report_type);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_source_systems_updated_at BEFORE UPDATE ON source_systems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_target_platforms_updated_at BEFORE UPDATE ON target_platforms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_migration_mappings_updated_at BEFORE UPDATE ON migration_mappings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_migration_plans_updated_at BEFORE UPDATE ON migration_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_migration_executions_updated_at BEFORE UPDATE ON migration_executions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Migration Dashboard View
CREATE VIEW v_migration_dashboard AS
SELECT 
    p.project_id,
    p.project_name,
    p.status as project_status,
    COUNT(DISTINCT ss.source_id) as total_sources,
    COUNT(DISTINCT tp.target_id) as total_targets,
    COUNT(DISTINCT mm.mapping_id) as total_mappings,
    COUNT(DISTINCT mp.plan_id) as total_plans,
    AVG(mm.compatibility_score) as avg_compatibility_score,
    AVG(mm.overall_risk_score) as avg_risk_score
FROM projects p
LEFT JOIN source_systems ss ON p.project_id = ss.project_id
LEFT JOIN target_platforms tp ON p.project_id = tp.project_id
LEFT JOIN migration_mappings mm ON p.project_id = mm.project_id
LEFT JOIN migration_plans mp ON p.project_id = mp.project_id
GROUP BY p.project_id, p.project_name, p.status;

-- Source System Summary View
CREATE VIEW v_source_summary AS
SELECT 
    system_type,
    hosting_type,
    COUNT(*) as system_count,
    SUM(database_size_gb) as total_size_gb,
    AVG(database_size_gb) as avg_size_gb,
    AVG(avg_iops) as avg_iops
FROM source_systems
WHERE discovery_status = 'completed'
GROUP BY system_type, hosting_type;

-- ============================================================================
-- SAMPLE DATA (for testing)
-- ============================================================================

-- Insert sample tenant
INSERT INTO tenants (tenant_name, tenant_code, subscription_tier)
VALUES ('Acme Corporation', 'ACME', 'enterprise');

-- ============================================================================
-- GRANTS (adjust based on your security model)
-- ============================================================================

-- Create roles
-- CREATE ROLE migration_admin;
-- CREATE ROLE migration_user;
-- CREATE ROLE migration_viewer;

-- Grant permissions
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO migration_admin;
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO migration_user;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO migration_viewer;

-- Made with Bob
