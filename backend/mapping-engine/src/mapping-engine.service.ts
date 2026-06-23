import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/**
 * Mapping Engine Service
 * Core service for intelligent source-to-target database mapping
 */
@Injectable()
export class MappingEngineService {
  private readonly logger = new Logger(MappingEngineService.name);

  constructor(
    @InjectRepository('SourceSystem') private sourceRepo: Repository<any>,
    @InjectRepository('TargetPlatform') private targetRepo: Repository<any>,
    @InjectRepository('MigrationMapping') private mappingRepo: Repository<any>,
    @InjectModel('CompatibilityRule') private compatibilityModel: Model<any>,
    @InjectModel('DataTypeMapping') private dataTypeMappingModel: Model<any>,
    @InjectModel('MigrationPattern') private migrationPatternModel: Model<any>,
    @InjectModel('CloudService') private cloudServiceModel: Model<any>,
  ) {}

  /**
   * Generate source-to-target mapping with compatibility analysis
   */
  async generateMapping(sourceId: string, targetId: string): Promise<any> {
    this.logger.log(`Generating mapping for source: ${sourceId}, target: ${targetId}`);

    try {
      // 1. Fetch source and target details
      const source = await this.sourceRepo.findOne({ where: { source_id: sourceId } });
      const target = await this.targetRepo.findOne({ where: { target_id: targetId } });

      if (!source || !target) {
        throw new Error('Source or target not found');
      }

      // 2. Analyze compatibility
      const compatibilityAnalysis = await this.analyzeCompatibility(source, target);

      // 3. Determine migration pattern
      const migrationPattern = await this.determineMigrationPattern(source, target, compatibilityAnalysis);

      // 4. Assess risks
      const riskAssessment = await this.assessRisks(source, target, compatibilityAnalysis);

      // 5. Generate transformation rules
      const transformationRules = await this.generateTransformationRules(source, target);

      // 6. Recommend tools
      const toolRecommendations = await this.recommendTools(source, target, migrationPattern);

      // 7. Estimate effort
      const effortEstimate = await this.estimateEffort(source, target, migrationPattern, compatibilityAnalysis);

      // 8. Create mapping record
      const mapping = await this.mappingRepo.save({
        project_id: source.project_id,
        source_id: sourceId,
        target_id: targetId,
        migration_pattern: migrationPattern.pattern_type,
        migration_approach: this.determineMigrationApproach(source, target),
        migration_type: this.determineMigrationType(source),
        compatibility_score: compatibilityAnalysis.overall_score,
        compatibility_status: compatibilityAnalysis.status,
        overall_risk_score: riskAssessment.overall_score,
        compatibility_risk: riskAssessment.compatibility_risk,
        performance_risk: riskAssessment.performance_risk,
        data_loss_risk: riskAssessment.data_loss_risk,
        complexity_risk: riskAssessment.complexity_risk,
        schema_changes_required: transformationRules.schema_changes_required,
        data_type_conversions_required: transformationRules.data_type_conversions_required,
        code_refactoring_required: transformationRules.code_refactoring_required,
        estimated_duration_days: effortEstimate.duration_days,
        estimated_complexity: effortEstimate.complexity,
        recommended_tools: toolRecommendations,
        mapping_status: 'generated',
        compatibility_details: compatibilityAnalysis,
        risk_details: riskAssessment,
        transformation_rules: transformationRules,
      });

      this.logger.log(`Mapping generated successfully: ${mapping.mapping_id}`);

      return {
        mapping_id: mapping.mapping_id,
        compatibility_analysis: compatibilityAnalysis,
        migration_pattern: migrationPattern,
        risk_assessment: riskAssessment,
        transformation_rules: transformationRules,
        tool_recommendations: toolRecommendations,
        effort_estimate: effortEstimate,
      };
    } catch (error) {
      this.logger.error(`Error generating mapping: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Analyze compatibility between source and target
   */
  private async analyzeCompatibility(source: any, target: any): Promise<any> {
    this.logger.log(`Analyzing compatibility: ${source.system_type} -> ${target.target_engine}`);

    // Fetch applicable compatibility rules
    const rules = await this.compatibilityModel.find({
      source_type: source.system_type,
      target_type: target.target_engine,
      $or: [
        { cloud_provider: target.cloud_provider },
        { cloud_provider: 'Any' }
      ]
    }).exec();

    if (rules.length === 0) {
      this.logger.warn(`No compatibility rules found for ${source.system_type} -> ${target.target_engine}`);
      return {
        overall_score: 50,
        status: 'unknown',
        message: 'No compatibility rules available',
        details: []
      };
    }

    // Calculate overall compatibility score
    const totalScore = rules.reduce((sum, rule) => sum + rule.compatibility_score, 0);
    const avgScore = totalScore / rules.length;

    // Categorize rules by status
    const compatible = rules.filter(r => r.compatibility_status === 'compatible');
    const partial = rules.filter(r => r.compatibility_status === 'partial');
    const incompatible = rules.filter(r => r.compatibility_status === 'incompatible');
    const requiresTransformation = rules.filter(r => r.compatibility_status === 'requires_transformation');

    // Determine overall status
    let status = 'compatible';
    if (incompatible.length > 0) {
      status = 'incompatible';
    } else if (requiresTransformation.length > 0 || partial.length > 0) {
      status = 'partial';
    }

    // Analyze data type compatibility
    const dataTypeCompatibility = await this.analyzeDataTypeCompatibility(source, target);

    // Analyze feature compatibility
    const featureCompatibility = await this.analyzeFeatureCompatibility(source, target, rules);

    return {
      overall_score: Math.round(avgScore),
      status,
      compatible_features: compatible.length,
      partial_features: partial.length,
      incompatible_features: incompatible.length,
      transformation_required: requiresTransformation.length,
      data_type_compatibility: dataTypeCompatibility,
      feature_compatibility: featureCompatibility,
      details: rules.map(rule => ({
        category: rule.rule_category,
        name: rule.rule_name,
        status: rule.compatibility_status,
        score: rule.compatibility_score,
        transformation_required: rule.transformation_required,
        risk_level: rule.risk_level,
        mitigation: rule.mitigation_strategy
      }))
    };
  }

  /**
   * Analyze data type compatibility
   */
  private async analyzeDataTypeCompatibility(source: any, target: any): Promise<any> {
    const mappings = await this.dataTypeMappingModel.find({
      source_type: source.system_type,
      target_type: target.target_engine
    }).exec();

    const directMappings = mappings.filter(m => m.mapping_type === 'direct');
    const approximateMappings = mappings.filter(m => m.mapping_type === 'approximate');
    const lossyMappings = mappings.filter(m => m.mapping_type === 'lossy');
    const customMappings = mappings.filter(m => m.mapping_type === 'custom');

    const compatibilityScore = (
      (directMappings.length * 100) +
      (approximateMappings.length * 75) +
      (lossyMappings.length * 50) +
      (customMappings.length * 60)
    ) / mappings.length;

    return {
      total_mappings: mappings.length,
      direct_mappings: directMappings.length,
      approximate_mappings: approximateMappings.length,
      lossy_mappings: lossyMappings.length,
      custom_mappings: customMappings.length,
      compatibility_score: Math.round(compatibilityScore),
      high_risk_mappings: mappings.filter(m => m.data_loss_risk === 'high' || m.data_loss_risk === 'medium')
    };
  }

  /**
   * Analyze feature compatibility
   */
  private async analyzeFeatureCompatibility(source: any, target: any, rules: any[]): Promise<any> {
    const featureRules = rules.filter(r => r.rule_category === 'feature');

    const features = {
      stored_procedures: this.checkFeatureCompatibility(featureRules, 'stored_procedures'),
      triggers: this.checkFeatureCompatibility(featureRules, 'triggers'),
      views: this.checkFeatureCompatibility(featureRules, 'views'),
      indexes: this.checkFeatureCompatibility(featureRules, 'indexes'),
      partitioning: this.checkFeatureCompatibility(featureRules, 'partitioning'),
      replication: this.checkFeatureCompatibility(featureRules, 'replication'),
      encryption: this.checkFeatureCompatibility(featureRules, 'encryption'),
    };

    return features;
  }

  /**
   * Check specific feature compatibility
   */
  private checkFeatureCompatibility(rules: any[], featureName: string): any {
    const featureRule = rules.find(r => r.rule_name.toLowerCase().includes(featureName));
    
    if (!featureRule) {
      return { status: 'unknown', score: 50 };
    }

    return {
      status: featureRule.compatibility_status,
      score: featureRule.compatibility_score,
      transformation_required: featureRule.transformation_required,
      complexity: featureRule.transformation_complexity
    };
  }

  /**
   * Determine optimal migration pattern
   */
  private async determineMigrationPattern(source: any, target: any, compatibility: any): Promise<any> {
    const patterns = await this.migrationPatternModel.find({
      source_types: source.system_type,
      target_types: { $in: [target.target_service, target.target_engine] }
    }).exec();

    if (patterns.length === 0) {
      // Default to replatform if no specific pattern found
      return {
        pattern_type: 'replatform',
        pattern_name: 'Replatform to Managed Service',
        complexity: 'moderate'
      };
    }

    // Score patterns based on compatibility and requirements
    const scoredPatterns = patterns.map(pattern => {
      let score = 0;

      // Prefer simpler patterns for high compatibility
      if (compatibility.overall_score > 80 && pattern.complexity === 'simple') {
        score += 30;
      }

      // Prefer replatform for managed services
      if (target.target_service.includes('RDS') || target.target_service.includes('SQL') || 
          target.target_service.includes('Cloud SQL')) {
        if (pattern.pattern_type === 'replatform') score += 20;
      }

      // Consider workload type
      if (source.workload_type === 'OLTP' && pattern.pattern_type === 'rehost') {
        score += 10;
      }

      // Consider database size
      if (source.database_size_gb > 1000 && pattern.complexity === 'simple') {
        score += 15;
      }

      return { ...pattern.toObject(), score };
    });

    // Return highest scored pattern
    scoredPatterns.sort((a, b) => b.score - a.score);
    return scoredPatterns[0];
  }

  /**
   * Assess migration risks
   */
  private async assessRisks(source: any, target: any, compatibility: any): Promise<any> {
    // Compatibility risk
    const compatibilityRisk = this.calculateRiskLevel(compatibility.overall_score, true);

    // Performance risk
    const performanceRisk = this.assessPerformanceRisk(source, target);

    // Data loss risk
    const dataLossRisk = this.assessDataLossRisk(compatibility.data_type_compatibility);

    // Complexity risk
    const complexityRisk = this.assessComplexityRisk(source, compatibility);

    // Calculate overall risk score
    const riskScores = {
      compatibility: this.riskToScore(compatibilityRisk),
      performance: this.riskToScore(performanceRisk),
      data_loss: this.riskToScore(dataLossRisk),
      complexity: this.riskToScore(complexityRisk)
    };

    const overallScore = Math.round(
      (riskScores.compatibility + riskScores.performance + 
       riskScores.data_loss + riskScores.complexity) / 4
    );

    return {
      overall_score: overallScore,
      overall_risk: this.scoreToRisk(overallScore),
      compatibility_risk: compatibilityRisk,
      performance_risk: performanceRisk,
      data_loss_risk: dataLossRisk,
      complexity_risk: complexityRisk,
      risk_factors: this.identifyRiskFactors(source, target, compatibility),
      mitigation_recommendations: this.generateMitigationRecommendations(
        compatibilityRisk, performanceRisk, dataLossRisk, complexityRisk
      )
    };
  }

  /**
   * Calculate risk level from score
   */
  private calculateRiskLevel(score: number, inverse: boolean = false): string {
    const actualScore = inverse ? 100 - score : score;
    
    if (actualScore >= 75) return 'low';
    if (actualScore >= 50) return 'medium';
    if (actualScore >= 25) return 'high';
    return 'critical';
  }

  /**
   * Assess performance risk
   */
  private assessPerformanceRisk(source: any, target: any): string {
    let riskScore = 0;

    // Check IOPS requirements
    if (source.avg_iops && target.required_iops) {
      if (target.required_iops < source.avg_iops * 0.8) {
        riskScore += 30;
      }
    }

    // Check latency requirements
    if (source.avg_latency_ms && target.max_latency_ms) {
      if (target.max_latency_ms > source.avg_latency_ms * 1.5) {
        riskScore += 25;
      }
    }

    // Check workload type compatibility
    if (source.workload_type === 'OLTP' && !target.target_service.includes('OLTP')) {
      riskScore += 20;
    }

    return this.scoreToRisk(riskScore);
  }

  /**
   * Assess data loss risk
   */
  private assessDataLossRisk(dataTypeCompatibility: any): string {
    if (!dataTypeCompatibility) return 'medium';

    const lossyPercentage = (dataTypeCompatibility.lossy_mappings / 
                            dataTypeCompatibility.total_mappings) * 100;

    if (lossyPercentage > 20) return 'high';
    if (lossyPercentage > 10) return 'medium';
    return 'low';
  }

  /**
   * Assess complexity risk
   */
  private assessComplexityRisk(source: any, compatibility: any): string {
    let complexityScore = 0;

    // Database size
    if (source.database_size_gb > 5000) complexityScore += 20;
    else if (source.database_size_gb > 1000) complexityScore += 10;

    // Schema complexity
    if (source.stored_procedure_count > 500) complexityScore += 15;
    if (source.table_count > 1000) complexityScore += 10;

    // Compatibility issues
    if (compatibility.incompatible_features > 0) complexityScore += 25;
    if (compatibility.transformation_required > 5) complexityScore += 20;

    return this.scoreToRisk(complexityScore);
  }

  /**
   * Convert risk level to score
   */
  private riskToScore(risk: string): number {
    const riskMap = { low: 10, medium: 40, high: 70, critical: 95 };
    return riskMap[risk] || 50;
  }

  /**
   * Convert score to risk level
   */
  private scoreToRisk(score: number): string {
    if (score <= 25) return 'low';
    if (score <= 50) return 'medium';
    if (score <= 75) return 'high';
    return 'critical';
  }

  /**
   * Identify specific risk factors
   */
  private identifyRiskFactors(source: any, target: any, compatibility: any): string[] {
    const factors = [];

    if (source.database_size_gb > 5000) {
      factors.push('Very large database size may extend migration duration');
    }

    if (compatibility.incompatible_features > 0) {
      factors.push(`${compatibility.incompatible_features} incompatible features require refactoring`);
    }

    if (source.stored_procedure_count > 100) {
      factors.push('High number of stored procedures may require significant code conversion');
    }

    if (source.compliance_requirements && source.compliance_requirements.length > 0) {
      factors.push('Compliance requirements must be validated in target environment');
    }

    return factors;
  }

  /**
   * Generate mitigation recommendations
   */
  private generateMitigationRecommendations(...risks: string[]): string[] {
    const recommendations = [];

    if (risks.includes('high') || risks.includes('critical')) {
      recommendations.push('Conduct thorough proof-of-concept before full migration');
      recommendations.push('Implement phased migration approach');
      recommendations.push('Establish comprehensive rollback procedures');
    }

    recommendations.push('Perform extensive testing in non-production environment');
    recommendations.push('Implement automated validation and reconciliation');
    recommendations.push('Monitor performance metrics closely post-migration');

    return recommendations;
  }

  /**
   * Generate transformation rules
   */
  private async generateTransformationRules(source: any, target: any): Promise<any> {
    const dataTypeMappings = await this.dataTypeMappingModel.find({
      source_type: source.system_type,
      target_type: target.target_engine
    }).exec();

    return {
      schema_changes_required: source.stored_procedure_count > 0 || source.view_count > 50,
      data_type_conversions_required: dataTypeMappings.some(m => m.mapping_type !== 'direct'),
      code_refactoring_required: source.stored_procedure_count > 0,
      data_type_mappings: dataTypeMappings.map(m => ({
        source_type: m.source_data_type,
        target_type: m.target_data_type,
        mapping_type: m.mapping_type,
        conversion_function: m.conversion_function
      })),
      schema_transformations: this.generateSchemaTransformations(source, target),
      code_transformations: this.generateCodeTransformations(source, target)
    };
  }

  /**
   * Generate schema transformations
   */
  private generateSchemaTransformations(source: any, target: any): any[] {
    const transformations = [];

    if (source.system_type === 'Oracle' && target.target_engine === 'PostgreSQL') {
      transformations.push({
        type: 'sequence',
        description: 'Convert Oracle sequences to PostgreSQL sequences',
        example: 'CREATE SEQUENCE seq_name START WITH 1 INCREMENT BY 1'
      });

      transformations.push({
        type: 'package',
        description: 'Refactor Oracle packages into PostgreSQL schemas and functions',
        complexity: 'high'
      });
    }

    return transformations;
  }

  /**
   * Generate code transformations
   */
  private generateCodeTransformations(source: any, target: any): any[] {
    const transformations = [];

    if (source.stored_procedure_count > 0) {
      transformations.push({
        type: 'stored_procedure',
        count: source.stored_procedure_count,
        description: 'Convert stored procedures to target database syntax',
        estimated_effort: this.estimateCodeConversionEffort(source.stored_procedure_count)
      });
    }

    return transformations;
  }

  /**
   * Estimate code conversion effort
   */
  private estimateCodeConversionEffort(count: number): string {
    if (count < 10) return 'Low (1-2 days)';
    if (count < 50) return 'Medium (1-2 weeks)';
    if (count < 200) return 'High (2-4 weeks)';
    return 'Very High (1-3 months)';
  }

  /**
   * Recommend migration tools
   */
  private async recommendTools(source: any, target: any, pattern: any): Promise<string[]> {
    const tools = [];

    // Cloud-specific tools
    if (target.cloud_provider === 'AWS') {
      tools.push('AWS Database Migration Service (DMS)');
      if (source.system_type === 'Oracle' || source.system_type === 'SQL Server') {
        tools.push('AWS Schema Conversion Tool (SCT)');
      }
    } else if (target.cloud_provider === 'Azure') {
      tools.push('Azure Database Migration Service');
      tools.push('Data Migration Assistant');
    } else if (target.cloud_provider === 'GCP') {
      tools.push('Google Cloud Database Migration Service');
    }

    // Source-specific tools
    if (source.system_type === 'Oracle') {
      tools.push('ora2pg (for PostgreSQL targets)');
    }

    // Generic tools
    tools.push('Native backup/restore utilities');
    
    if (pattern.pattern_type === 'replatform' || pattern.pattern_type === 'refactor') {
      tools.push('Data validation and reconciliation tools');
    }

    return tools;
  }

  /**
   * Estimate migration effort
   */
  private async estimateEffort(source: any, target: any, pattern: any, compatibility: any): Promise<any> {
    let baseDays = 0;

    // Base effort by database size
    if (source.database_size_gb < 100) baseDays = 5;
    else if (source.database_size_gb < 500) baseDays = 10;
    else if (source.database_size_gb < 1000) baseDays = 20;
    else if (source.database_size_gb < 5000) baseDays = 40;
    else baseDays = 60;

    // Adjust for pattern complexity
    const complexityMultiplier = {
      simple: 1.0,
      moderate: 1.5,
      complex: 2.0,
      very_complex: 3.0
    };
    baseDays *= complexityMultiplier[pattern.complexity] || 1.5;

    // Adjust for compatibility
    if (compatibility.overall_score < 50) baseDays *= 1.5;
    else if (compatibility.overall_score < 75) baseDays *= 1.2;

    // Adjust for schema complexity
    if (source.stored_procedure_count > 100) baseDays += 10;
    if (source.table_count > 500) baseDays += 5;

    const complexity = baseDays < 15 ? 'simple' : 
                      baseDays < 30 ? 'moderate' : 
                      baseDays < 60 ? 'complex' : 'very_complex';

    return {
      duration_days: Math.ceil(baseDays),
      complexity,
      breakdown: {
        discovery_and_assessment: Math.ceil(baseDays * 0.15),
        schema_conversion: Math.ceil(baseDays * 0.25),
        data_migration: Math.ceil(baseDays * 0.30),
        testing_and_validation: Math.ceil(baseDays * 0.20),
        cutover_and_stabilization: Math.ceil(baseDays * 0.10)
      }
    };
  }

  /**
   * Determine migration approach (online vs offline)
   */
  private determineMigrationApproach(source: any, target: any): string {
    // If database is small, offline is acceptable
    if (source.database_size_gb < 100) return 'offline';

    // For OLTP workloads, prefer online
    if (source.workload_type === 'OLTP') return 'online';

    // For large databases, prefer online with minimal downtime
    if (source.database_size_gb > 1000) return 'online';

    return 'hybrid';
  }

  /**
   * Determine migration type (big bang vs phased)
   */
  private determineMigrationType(source: any): string {
    // For very large or complex databases, recommend phased
    if (source.database_size_gb > 5000 || source.table_count > 1000) {
      return 'phased';
    }

    // For smaller databases, big bang is acceptable
    if (source.database_size_gb < 500) {
      return 'big-bang';
    }

    return 'phased';
  }

  /**
   * Get mapping by ID
   */
  async getMapping(mappingId: string): Promise<any> {
    return await this.mappingRepo.findOne({ 
      where: { mapping_id: mappingId },
      relations: ['source', 'target']
    });
  }

  /**
   * Get all mappings for a project
   */
  async getProjectMappings(projectId: string): Promise<any[]> {
    return await this.mappingRepo.find({ 
      where: { project_id: projectId },
      relations: ['source', 'target']
    });
  }

  /**
   * Update mapping status
   */
  async updateMappingStatus(mappingId: string, status: string, userId?: string): Promise<any> {
    const mapping = await this.mappingRepo.findOne({ where: { mapping_id: mappingId } });
    
    if (!mapping) {
      throw new Error('Mapping not found');
    }

    mapping.mapping_status = status;
    
    if (status === 'approved' && userId) {
      mapping.approved_by = userId;
      mapping.approved_at = new Date();
    }

    return await this.mappingRepo.save(mapping);
  }
}

// Made with Bob
