// ============================================================================
// Data Migration Tool - MongoDB Schema
// Rules Engine and Knowledge Base
// ============================================================================

// ============================================================================
// COMPATIBILITY RULES COLLECTION
// ============================================================================

db.createCollection("compatibility_rules", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["rule_id", "source_type", "target_type", "rule_category"],
      properties: {
        rule_id: {
          bsonType: "string",
          description: "Unique rule identifier"
        },
        rule_name: {
          bsonType: "string",
          description: "Human-readable rule name"
        },
        source_type: {
          bsonType: "string",
          description: "Source database type (e.g., Oracle, SQL Server)"
        },
        source_version: {
          bsonType: "string",
          description: "Source version or version range"
        },
        target_type: {
          bsonType: "string",
          description: "Target database type"
        },
        target_version: {
          bsonType: "string",
          description: "Target version or version range"
        },
        cloud_provider: {
          bsonType: "string",
          enum: ["AWS", "Azure", "GCP", "Any"],
          description: "Cloud provider"
        },
        rule_category: {
          bsonType: "string",
          enum: ["data_type", "feature", "syntax", "performance", "security"],
          description: "Category of compatibility rule"
        },
        compatibility_status: {
          bsonType: "string",
          enum: ["compatible", "partial", "incompatible", "requires_transformation"],
          description: "Compatibility status"
        },
        compatibility_score: {
          bsonType: "int",
          minimum: 0,
          maximum: 100,
          description: "Compatibility score (0-100)"
        },
        transformation_required: {
          bsonType: "bool",
          description: "Whether transformation is required"
        },
        transformation_complexity: {
          bsonType: "string",
          enum: ["simple", "moderate", "complex", "very_complex"],
          description: "Complexity of required transformation"
        },
        transformation_logic: {
          bsonType: "object",
          description: "Transformation logic and rules"
        },
        risk_level: {
          bsonType: "string",
          enum: ["low", "medium", "high", "critical"],
          description: "Risk level"
        },
        risk_description: {
          bsonType: "string",
          description: "Description of risks"
        },
        mitigation_strategy: {
          bsonType: "string",
          description: "Risk mitigation strategy"
        },
        examples: {
          bsonType: "array",
          description: "Example scenarios"
        },
        documentation_links: {
          bsonType: "array",
          description: "Links to relevant documentation"
        },
        created_at: {
          bsonType: "date",
          description: "Creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        },
        tags: {
          bsonType: "array",
          description: "Tags for categorization"
        }
      }
    }
  }
});

// Create indexes
db.compatibility_rules.createIndex({ "source_type": 1, "target_type": 1 });
db.compatibility_rules.createIndex({ "rule_category": 1 });
db.compatibility_rules.createIndex({ "compatibility_status": 1 });
db.compatibility_rules.createIndex({ "cloud_provider": 1 });
db.compatibility_rules.createIndex({ "tags": 1 });

// ============================================================================
// DATA TYPE MAPPING COLLECTION
// ============================================================================

db.createCollection("data_type_mappings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["source_type", "source_data_type", "target_type", "target_data_type"],
      properties: {
        source_type: {
          bsonType: "string",
          description: "Source database type"
        },
        source_data_type: {
          bsonType: "string",
          description: "Source data type"
        },
        source_precision: {
          bsonType: "object",
          description: "Source precision/scale constraints"
        },
        target_type: {
          bsonType: "string",
          description: "Target database type"
        },
        target_data_type: {
          bsonType: "string",
          description: "Target data type"
        },
        target_precision: {
          bsonType: "object",
          description: "Target precision/scale constraints"
        },
        mapping_type: {
          bsonType: "string",
          enum: ["direct", "approximate", "lossy", "custom"],
          description: "Type of mapping"
        },
        data_loss_risk: {
          bsonType: "string",
          enum: ["none", "low", "medium", "high"],
          description: "Risk of data loss"
        },
        conversion_function: {
          bsonType: "string",
          description: "Conversion function or logic"
        },
        notes: {
          bsonType: "string",
          description: "Additional notes"
        }
      }
    }
  }
});

db.data_type_mappings.createIndex({ "source_type": 1, "source_data_type": 1 });
db.data_type_mappings.createIndex({ "target_type": 1, "target_data_type": 1 });

// ============================================================================
// MIGRATION PATTERNS COLLECTION
// ============================================================================

db.createCollection("migration_patterns", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["pattern_id", "pattern_name", "pattern_type"],
      properties: {
        pattern_id: {
          bsonType: "string",
          description: "Unique pattern identifier"
        },
        pattern_name: {
          bsonType: "string",
          description: "Pattern name"
        },
        pattern_type: {
          bsonType: "string",
          enum: ["rehost", "replatform", "refactor", "rebuild", "replace"],
          description: "Migration pattern type"
        },
        description: {
          bsonType: "string",
          description: "Pattern description"
        },
        use_cases: {
          bsonType: "array",
          description: "Applicable use cases"
        },
        source_types: {
          bsonType: "array",
          description: "Applicable source database types"
        },
        target_types: {
          bsonType: "array",
          description: "Applicable target database types"
        },
        complexity: {
          bsonType: "string",
          enum: ["simple", "moderate", "complex", "very_complex"],
          description: "Pattern complexity"
        },
        effort_estimate: {
          bsonType: "object",
          description: "Effort estimation parameters"
        },
        advantages: {
          bsonType: "array",
          description: "Pattern advantages"
        },
        disadvantages: {
          bsonType: "array",
          description: "Pattern disadvantages"
        },
        prerequisites: {
          bsonType: "array",
          description: "Prerequisites for this pattern"
        },
        steps: {
          bsonType: "array",
          description: "Migration steps"
        },
        tools: {
          bsonType: "array",
          description: "Recommended tools"
        },
        best_practices: {
          bsonType: "array",
          description: "Best practices"
        }
      }
    }
  }
});

db.migration_patterns.createIndex({ "pattern_type": 1 });
db.migration_patterns.createIndex({ "source_types": 1 });
db.migration_patterns.createIndex({ "target_types": 1 });

// ============================================================================
// CLOUD SERVICE CATALOG COLLECTION
// ============================================================================

db.createCollection("cloud_services", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["service_id", "cloud_provider", "service_name", "service_type"],
      properties: {
        service_id: {
          bsonType: "string",
          description: "Unique service identifier"
        },
        cloud_provider: {
          bsonType: "string",
          enum: ["AWS", "Azure", "GCP"],
          description: "Cloud provider"
        },
        service_name: {
          bsonType: "string",
          description: "Service name"
        },
        service_type: {
          bsonType: "string",
          enum: ["relational", "nosql", "data_warehouse", "cache", "graph"],
          description: "Service type"
        },
        database_engine: {
          bsonType: "string",
          description: "Database engine"
        },
        supported_versions: {
          bsonType: "array",
          description: "Supported versions"
        },
        deployment_options: {
          bsonType: "array",
          description: "Deployment options"
        },
        features: {
          bsonType: "object",
          description: "Service features"
        },
        pricing_model: {
          bsonType: "object",
          description: "Pricing information"
        },
        performance_characteristics: {
          bsonType: "object",
          description: "Performance characteristics"
        },
        compliance_certifications: {
          bsonType: "array",
          description: "Compliance certifications"
        },
        migration_tools: {
          bsonType: "array",
          description: "Available migration tools"
        },
        documentation_url: {
          bsonType: "string",
          description: "Documentation URL"
        }
      }
    }
  }
});

db.cloud_services.createIndex({ "cloud_provider": 1, "service_type": 1 });
db.cloud_services.createIndex({ "database_engine": 1 });

// ============================================================================
// TRANSFORMATION RULES COLLECTION
// ============================================================================

db.createCollection("transformation_rules", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["rule_id", "transformation_type", "source_pattern", "target_pattern"],
      properties: {
        rule_id: {
          bsonType: "string",
          description: "Unique rule identifier"
        },
        transformation_type: {
          bsonType: "string",
          enum: ["schema", "data", "code", "configuration"],
          description: "Type of transformation"
        },
        source_pattern: {
          bsonType: "object",
          description: "Source pattern to match"
        },
        target_pattern: {
          bsonType: "object",
          description: "Target pattern to generate"
        },
        transformation_logic: {
          bsonType: "string",
          description: "Transformation logic"
        },
        validation_rules: {
          bsonType: "array",
          description: "Validation rules"
        },
        examples: {
          bsonType: "array",
          description: "Transformation examples"
        }
      }
    }
  }
});

db.transformation_rules.createIndex({ "transformation_type": 1 });

// ============================================================================
// RISK ASSESSMENT RULES COLLECTION
// ============================================================================

db.createCollection("risk_rules", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["rule_id", "risk_category", "risk_level"],
      properties: {
        rule_id: {
          bsonType: "string",
          description: "Unique rule identifier"
        },
        risk_category: {
          bsonType: "string",
          enum: ["compatibility", "performance", "data_loss", "downtime", "complexity", "cost"],
          description: "Risk category"
        },
        risk_level: {
          bsonType: "string",
          enum: ["low", "medium", "high", "critical"],
          description: "Risk level"
        },
        conditions: {
          bsonType: "array",
          description: "Conditions that trigger this risk"
        },
        impact_description: {
          bsonType: "string",
          description: "Description of impact"
        },
        probability: {
          bsonType: "string",
          enum: ["rare", "unlikely", "possible", "likely", "almost_certain"],
          description: "Probability of occurrence"
        },
        mitigation_strategies: {
          bsonType: "array",
          description: "Mitigation strategies"
        },
        detection_methods: {
          bsonType: "array",
          description: "Methods to detect this risk"
        }
      }
    }
  }
});

db.risk_rules.createIndex({ "risk_category": 1, "risk_level": 1 });

// ============================================================================
// SAMPLE DATA
// ============================================================================

// Sample Compatibility Rules
db.compatibility_rules.insertMany([
  {
    rule_id: "COMPAT_001",
    rule_name: "Oracle to PostgreSQL - Basic Compatibility",
    source_type: "Oracle",
    source_version: "11g+",
    target_type: "PostgreSQL",
    target_version: "12+",
    cloud_provider: "Any",
    rule_category: "feature",
    compatibility_status: "partial",
    compatibility_score: 75,
    transformation_required: true,
    transformation_complexity: "moderate",
    transformation_logic: {
      stored_procedures: "Convert PL/SQL to PL/pgSQL",
      sequences: "Map Oracle sequences to PostgreSQL sequences",
      packages: "Refactor packages into schemas and functions"
    },
    risk_level: "medium",
    risk_description: "Some Oracle-specific features require refactoring",
    mitigation_strategy: "Use AWS SCT or ora2pg for automated conversion",
    examples: [
      {
        source: "CREATE SEQUENCE seq_id START WITH 1;",
        target: "CREATE SEQUENCE seq_id START 1;"
      }
    ],
    documentation_links: [
      "https://wiki.postgresql.org/wiki/Oracle_to_Postgres_Conversion"
    ],
    created_at: new Date(),
    updated_at: new Date(),
    tags: ["oracle", "postgresql", "migration"]
  },
  {
    rule_id: "COMPAT_002",
    rule_name: "SQL Server to Azure SQL - High Compatibility",
    source_type: "SQL Server",
    source_version: "2016+",
    target_type: "Azure SQL Database",
    target_version: "Latest",
    cloud_provider: "Azure",
    rule_category: "feature",
    compatibility_status: "compatible",
    compatibility_score: 95,
    transformation_required: false,
    transformation_complexity: "simple",
    risk_level: "low",
    risk_description: "Minimal compatibility issues",
    mitigation_strategy: "Use Azure Database Migration Service",
    created_at: new Date(),
    updated_at: new Date(),
    tags: ["sqlserver", "azure", "migration"]
  }
]);

// Sample Data Type Mappings
db.data_type_mappings.insertMany([
  {
    source_type: "Oracle",
    source_data_type: "NUMBER",
    source_precision: { precision: 38, scale: 0 },
    target_type: "PostgreSQL",
    target_data_type: "NUMERIC",
    target_precision: { precision: 38, scale: 0 },
    mapping_type: "direct",
    data_loss_risk: "none",
    conversion_function: "CAST(column AS NUMERIC)",
    notes: "Direct mapping with same precision"
  },
  {
    source_type: "Oracle",
    source_data_type: "VARCHAR2",
    source_precision: { max_length: 4000 },
    target_type: "PostgreSQL",
    target_data_type: "VARCHAR",
    target_precision: { max_length: 4000 },
    mapping_type: "direct",
    data_loss_risk: "none",
    conversion_function: "Direct mapping",
    notes: "PostgreSQL supports larger VARCHAR sizes"
  },
  {
    source_type: "SQL Server",
    source_data_type: "DATETIME",
    target_type: "PostgreSQL",
    target_data_type: "TIMESTAMP",
    mapping_type: "approximate",
    data_loss_risk: "low",
    conversion_function: "CAST(column AS TIMESTAMP)",
    notes: "Precision differences may exist"
  }
]);

// Sample Migration Patterns
db.migration_patterns.insertMany([
  {
    pattern_id: "PATTERN_001",
    pattern_name: "Lift and Shift (Rehost)",
    pattern_type: "rehost",
    description: "Migrate database as-is to cloud infrastructure with minimal changes",
    use_cases: [
      "Quick migration with minimal downtime",
      "Legacy applications that cannot be modified",
      "Time-constrained migrations"
    ],
    source_types: ["Oracle", "SQL Server", "MySQL", "PostgreSQL"],
    target_types: ["AWS EC2", "Azure VM", "GCP Compute Engine"],
    complexity: "simple",
    effort_estimate: {
      small_db: "1-2 weeks",
      medium_db: "2-4 weeks",
      large_db: "4-8 weeks"
    },
    advantages: [
      "Fastest migration approach",
      "Minimal application changes",
      "Lower initial risk"
    ],
    disadvantages: [
      "Doesn't leverage cloud-native features",
      "May not optimize costs",
      "Technical debt carried forward"
    ],
    prerequisites: [
      "Source database backup",
      "Network connectivity",
      "Target infrastructure provisioned"
    ],
    steps: [
      "Backup source database",
      "Provision target infrastructure",
      "Restore database to target",
      "Update connection strings",
      "Validate and test"
    ],
    tools: ["Native backup/restore", "Storage Gateway", "DataSync"],
    best_practices: [
      "Test thoroughly in non-production",
      "Plan for rollback",
      "Monitor performance post-migration"
    ]
  },
  {
    pattern_id: "PATTERN_002",
    pattern_name: "Replatform to Managed Service",
    pattern_type: "replatform",
    description: "Migrate to cloud-managed database service with minimal code changes",
    use_cases: [
      "Reduce operational overhead",
      "Leverage managed service benefits",
      "Moderate timeline and budget"
    ],
    source_types: ["Oracle", "SQL Server", "MySQL", "PostgreSQL"],
    target_types: ["AWS RDS", "Azure SQL", "Cloud SQL"],
    complexity: "moderate",
    effort_estimate: {
      small_db: "2-4 weeks",
      medium_db: "4-8 weeks",
      large_db: "8-16 weeks"
    },
    advantages: [
      "Reduced operational overhead",
      "Built-in HA and backup",
      "Better scalability"
    ],
    disadvantages: [
      "Some feature limitations",
      "Vendor lock-in",
      "May require code changes"
    ],
    tools: ["AWS DMS", "Azure DMS", "GCP Database Migration Service"],
    best_practices: [
      "Use migration assessment tools",
      "Implement phased migration",
      "Validate compatibility early"
    ]
  }
]);

// Sample Cloud Services
db.cloud_services.insertMany([
  {
    service_id: "AWS_RDS_POSTGRES",
    cloud_provider: "AWS",
    service_name: "Amazon RDS for PostgreSQL",
    service_type: "relational",
    database_engine: "PostgreSQL",
    supported_versions: ["12", "13", "14", "15", "16"],
    deployment_options: ["Single-AZ", "Multi-AZ", "Read Replicas"],
    features: {
      automated_backups: true,
      point_in_time_recovery: true,
      encryption_at_rest: true,
      encryption_in_transit: true,
      monitoring: "CloudWatch",
      performance_insights: true
    },
    pricing_model: {
      type: "pay-as-you-go",
      factors: ["instance_type", "storage", "iops", "backup_storage"]
    },
    compliance_certifications: ["SOC", "PCI-DSS", "HIPAA", "GDPR"],
    migration_tools: ["AWS DMS", "AWS SCT", "pg_dump/restore"],
    documentation_url: "https://docs.aws.amazon.com/rds/postgresql/"
  },
  {
    service_id: "AZURE_SQL_DB",
    cloud_provider: "Azure",
    service_name: "Azure SQL Database",
    service_type: "relational",
    database_engine: "SQL Server",
    supported_versions: ["2019", "2022"],
    deployment_options: ["Single Database", "Elastic Pool", "Managed Instance"],
    features: {
      automated_backups: true,
      point_in_time_recovery: true,
      encryption_at_rest: true,
      encryption_in_transit: true,
      monitoring: "Azure Monitor",
      intelligent_performance: true
    },
    compliance_certifications: ["SOC", "PCI-DSS", "HIPAA", "GDPR", "ISO 27001"],
    migration_tools: ["Azure DMS", "Data Migration Assistant"],
    documentation_url: "https://docs.microsoft.com/azure/sql-database/"
  }
]);

console.log("MongoDB schema and sample data created successfully!");

// Made with Bob
