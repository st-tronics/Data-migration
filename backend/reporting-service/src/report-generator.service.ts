import { Injectable, Logger } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as ExcelJS from 'exceljs';
import { createWriteStream } from 'fs';
import { join } from 'path';

/**
 * Report Generator Service
 * Generates comprehensive migration reports in multiple formats
 */
@Injectable()
export class ReportGeneratorService {
  private readonly logger = new Logger(ReportGeneratorService.name);
  private readonly reportsDir = process.env.REPORTS_DIR || '/tmp/reports';

  /**
   * Generate comprehensive migration report
   */
  async generateMigrationReport(
    projectId: string,
    format: 'pdf' | 'excel' | 'json' = 'pdf'
  ): Promise<string> {
    this.logger.log(`Generating ${format} report for project: ${projectId}`);

    try {
      // Fetch project data
      const projectData = await this.fetchProjectData(projectId);

      // Generate report based on format
      let filePath: string;
      switch (format) {
        case 'pdf':
          filePath = await this.generatePDFReport(projectData);
          break;
        case 'excel':
          filePath = await this.generateExcelReport(projectData);
          break;
        case 'json':
          filePath = await this.generateJSONReport(projectData);
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      this.logger.log(`Report generated successfully: ${filePath}`);
      return filePath;
    } catch (error: any) {
      this.logger.error(`Error generating report: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate Source-to-Target Mapping Report
   */
  async generateMappingReport(mappingId: string, format: 'pdf' | 'excel' = 'pdf'): Promise<string> {
    this.logger.log(`Generating mapping report: ${mappingId}`);

    const mappingData = await this.fetchMappingData(mappingId);

    if (format === 'pdf') {
      return await this.generateMappingPDF(mappingData);
    } else {
      return await this.generateMappingExcel(mappingData);
    }
  }

  /**
   * Generate Compatibility Matrix Report
   */
  async generateCompatibilityReport(projectId: string): Promise<string> {
    this.logger.log(`Generating compatibility report for project: ${projectId}`);

    const compatibilityData = await this.fetchCompatibilityData(projectId);
    return await this.generateCompatibilityPDF(compatibilityData);
  }

  /**
   * Generate Migration Plan Document
   */
  async generateMigrationPlanDocument(planId: string): Promise<string> {
    this.logger.log(`Generating migration plan document: ${planId}`);

    const planData = await this.fetchMigrationPlanData(planId);
    return await this.generateMigrationPlanPDF(planData);
  }

  /**
   * Generate Executive Summary Report
   */
  async generateExecutiveSummary(projectId: string): Promise<string> {
    this.logger.log(`Generating executive summary for project: ${projectId}`);

    const summaryData = await this.fetchExecutiveSummaryData(projectId);
    return await this.generateExecutiveSummaryPDF(summaryData);
  }

  // ============================================================================
  // PDF Generation Methods
  // ============================================================================

  /**
   * Generate comprehensive PDF report
   */
  private async generatePDFReport(data: any): Promise<string> {
    const fileName = `migration-report-${data.project_id}-${Date.now()}.pdf`;
    const filePath = join(this.reportsDir, fileName);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = createWriteStream(filePath);

      doc.pipe(stream);

      // Title Page
      this.addPDFTitle(doc, 'Data Migration Report');
      doc.moveDown();
      doc.fontSize(14).text(`Project: ${data.project_name}`, { align: 'center' });
      doc.fontSize(12).text(`Project ID: ${data.project_id}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.addPage();

      // Table of Contents
      this.addPDFSection(doc, 'Table of Contents');
      const sections = [
        '1. Executive Summary',
        '2. Source System Overview',
        '3. Target Platform Configuration',
        '4. Compatibility Analysis',
        '5. Risk Assessment',
        '6. Migration Strategy',
        '7. Timeline and Phases',
        '8. Resource Requirements',
        '9. Cost Estimation',
        '10. Recommendations',
      ];
      sections.forEach(section => {
        doc.fontSize(11).text(section);
        doc.moveDown(0.5);
      });
      doc.addPage();

      // 1. Executive Summary
      this.addPDFSection(doc, '1. Executive Summary');
      doc.fontSize(11).text(data.executive_summary || 'Executive summary content...', {
        align: 'justify',
      });
      doc.moveDown();
      this.addPDFKeyMetrics(doc, data.key_metrics);
      doc.addPage();

      // 2. Source System Overview
      this.addPDFSection(doc, '2. Source System Overview');
      this.addPDFSourceDetails(doc, data.source_systems);
      doc.addPage();

      // 3. Target Platform Configuration
      this.addPDFSection(doc, '3. Target Platform Configuration');
      this.addPDFTargetDetails(doc, data.target_platforms);
      doc.addPage();

      // 4. Compatibility Analysis
      this.addPDFSection(doc, '4. Compatibility Analysis');
      this.addPDFCompatibilityAnalysis(doc, data.compatibility_analysis);
      doc.addPage();

      // 5. Risk Assessment
      this.addPDFSection(doc, '5. Risk Assessment');
      this.addPDFRiskAssessment(doc, data.risk_assessment);
      doc.addPage();

      // 6. Migration Strategy
      this.addPDFSection(doc, '6. Migration Strategy');
      this.addPDFMigrationStrategy(doc, data.migration_strategy);
      doc.addPage();

      // 7. Timeline and Phases
      this.addPDFSection(doc, '7. Timeline and Phases');
      this.addPDFTimeline(doc, data.timeline);
      doc.addPage();

      // 8. Resource Requirements
      this.addPDFSection(doc, '8. Resource Requirements');
      this.addPDFResourceRequirements(doc, data.resource_plan);
      doc.addPage();

      // 9. Cost Estimation
      this.addPDFSection(doc, '9. Cost Estimation');
      this.addPDFCostEstimation(doc, data.cost_estimation);
      doc.addPage();

      // 10. Recommendations
      this.addPDFSection(doc, '10. Recommendations');
      this.addPDFRecommendations(doc, data.recommendations);

      // Footer on each page
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).text(
          `Page ${i + 1} of ${pages.count}`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
      }

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }

  /**
   * Generate mapping PDF report
   */
  private async generateMappingPDF(data: any): Promise<string> {
    const fileName = `mapping-report-${data.mapping_id}-${Date.now()}.pdf`;
    const filePath = join(this.reportsDir, fileName);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = createWriteStream(filePath);

      doc.pipe(stream);

      // Title
      this.addPDFTitle(doc, 'Source-to-Target Mapping Report');
      doc.moveDown();
      doc.fontSize(12).text(`Mapping ID: ${data.mapping_id}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(11).text(`Source: ${data.source.system_name} (${data.source.system_type})`, {
        align: 'center',
      });
      doc.text(`Target: ${data.target.target_service} (${data.target.target_engine})`, {
        align: 'center',
      });
      doc.addPage();

      // Compatibility Score
      this.addPDFSection(doc, 'Compatibility Analysis');
      doc.fontSize(11).text(`Overall Compatibility Score: ${data.compatibility_score}%`);
      doc.moveDown();
      this.addPDFCompatibilityDetails(doc, data.compatibility_details);
      doc.addPage();

      // Data Type Mappings
      this.addPDFSection(doc, 'Data Type Mappings');
      this.addPDFDataTypeMappings(doc, data.data_type_mappings);
      doc.addPage();

      // Transformation Rules
      this.addPDFSection(doc, 'Transformation Rules');
      this.addPDFTransformationRules(doc, data.transformation_rules);
      doc.addPage();

      // Risk Assessment
      this.addPDFSection(doc, 'Risk Assessment');
      this.addPDFRiskDetails(doc, data.risk_details);

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }

  /**
   * Generate migration plan PDF
   */
  private async generateMigrationPlanPDF(data: any): Promise<string> {
    const fileName = `migration-plan-${data.plan_id}-${Date.now()}.pdf`;
    const filePath = join(this.reportsDir, fileName);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = createWriteStream(filePath);

      doc.pipe(stream);

      // Title Page
      this.addPDFTitle(doc, 'Migration Execution Plan');
      doc.moveDown();
      doc.fontSize(14).text(data.plan_name, { align: 'center' });
      doc.fontSize(12).text(`Version: ${data.plan_version}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.addPage();

      // Strategy Overview
      this.addPDFSection(doc, 'Migration Strategy');
      this.addPDFMigrationStrategy(doc, data.strategy);
      doc.addPage();

      // Timeline
      this.addPDFSection(doc, 'Timeline and Phases');
      this.addPDFDetailedTimeline(doc, data.timeline);
      doc.addPage();

      // Execution Steps
      this.addPDFSection(doc, 'Execution Steps');
      this.addPDFExecutionSteps(doc, data.execution_steps);
      doc.addPage();

      // Rollback Plan
      this.addPDFSection(doc, 'Rollback Plan');
      this.addPDFRollbackPlan(doc, data.rollback_plan);
      doc.addPage();

      // Validation Plan
      this.addPDFSection(doc, 'Validation Plan');
      this.addPDFValidationPlan(doc, data.validation_plan);
      doc.addPage();

      // Communication Plan
      this.addPDFSection(doc, 'Communication Plan');
      this.addPDFCommunicationPlan(doc, data.communication_plan);

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }

  // ============================================================================
  // Excel Generation Methods
  // ============================================================================

  /**
   * Generate comprehensive Excel report
   */
  private async generateExcelReport(data: any): Promise<string> {
    const fileName = `migration-report-${data.project_id}-${Date.now()}.xlsx`;
    const filePath = join(this.reportsDir, fileName);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Migration Tool';
    workbook.created = new Date();

    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Summary');
    this.addExcelSummary(summarySheet, data);

    // Source Systems Sheet
    const sourceSheet = workbook.addWorksheet('Source Systems');
    this.addExcelSourceSystems(sourceSheet, data.source_systems);

    // Target Platforms Sheet
    const targetSheet = workbook.addWorksheet('Target Platforms');
    this.addExcelTargetPlatforms(targetSheet, data.target_platforms);

    // Compatibility Analysis Sheet
    const compatSheet = workbook.addWorksheet('Compatibility');
    this.addExcelCompatibility(compatSheet, data.compatibility_analysis);

    // Risk Assessment Sheet
    const riskSheet = workbook.addWorksheet('Risk Assessment');
    this.addExcelRiskAssessment(riskSheet, data.risk_assessment);

    // Timeline Sheet
    const timelineSheet = workbook.addWorksheet('Timeline');
    this.addExcelTimeline(timelineSheet, data.timeline);

    // Cost Estimation Sheet
    const costSheet = workbook.addWorksheet('Cost Estimation');
    this.addExcelCostEstimation(costSheet, data.cost_estimation);

    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }

  /**
   * Generate mapping Excel report
   */
  private async generateMappingExcel(data: any): Promise<string> {
    const fileName = `mapping-report-${data.mapping_id}-${Date.now()}.xlsx`;
    const filePath = join(this.reportsDir, fileName);

    const workbook = new ExcelJS.Workbook();

    // Overview Sheet
    const overviewSheet = workbook.addWorksheet('Overview');
    this.addExcelMappingOverview(overviewSheet, data);

    // Data Type Mappings Sheet
    const dataTypeSheet = workbook.addWorksheet('Data Type Mappings');
    this.addExcelDataTypeMappings(dataTypeSheet, data.data_type_mappings);

    // Schema Mappings Sheet
    const schemaSheet = workbook.addWorksheet('Schema Mappings');
    this.addExcelSchemaMappings(schemaSheet, data.schema_mappings);

    // Transformation Rules Sheet
    const transformSheet = workbook.addWorksheet('Transformations');
    this.addExcelTransformations(transformSheet, data.transformation_rules);

    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }

  // ============================================================================
  // JSON Generation Methods
  // ============================================================================

  /**
   * Generate JSON report
   */
  private async generateJSONReport(data: any): Promise<string> {
    const fileName = `migration-report-${data.project_id}-${Date.now()}.json`;
    const filePath = join(this.reportsDir, fileName);

    const reportData = {
      report_metadata: {
        generated_at: new Date().toISOString(),
        report_type: 'comprehensive_migration_report',
        project_id: data.project_id,
        project_name: data.project_name,
      },
      executive_summary: data.executive_summary,
      source_systems: data.source_systems,
      target_platforms: data.target_platforms,
      compatibility_analysis: data.compatibility_analysis,
      risk_assessment: data.risk_assessment,
      migration_strategy: data.migration_strategy,
      timeline: data.timeline,
      resource_plan: data.resource_plan,
      cost_estimation: data.cost_estimation,
      recommendations: data.recommendations,
    };

    await require('fs').promises.writeFile(filePath, JSON.stringify(reportData, null, 2));
    return filePath;
  }

  // ============================================================================
  // Helper Methods for PDF Generation
  // ============================================================================

  private addPDFTitle(doc: any, title: string): void {
    doc.fontSize(20).font('Helvetica-Bold').text(title, { align: 'center' });
  }

  private addPDFSection(doc: any, title: string): void {
    doc.fontSize(16).font('Helvetica-Bold').text(title);
    doc.moveDown();
  }

  private addPDFKeyMetrics(doc: any, metrics: any): void {
    doc.fontSize(11).font('Helvetica-Bold').text('Key Metrics:');
    doc.font('Helvetica');
    Object.entries(metrics || {}).forEach(([key, value]) => {
      doc.text(`• ${key}: ${value}`);
    });
    doc.moveDown();
  }

  private addPDFSourceDetails(doc: any, sources: any[]): void {
    sources?.forEach((source, index) => {
      doc.fontSize(12).font('Helvetica-Bold').text(`Source System ${index + 1}: ${source.system_name}`);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Type: ${source.system_type}`);
      doc.text(`Version: ${source.system_version}`);
      doc.text(`Size: ${source.database_size_gb} GB`);
      doc.text(`Workload: ${source.workload_type}`);
      doc.moveDown();
    });
  }

  private addPDFTargetDetails(doc: any, targets: any[]): void {
    targets?.forEach((target, index) => {
      doc.fontSize(12).font('Helvetica-Bold').text(`Target Platform ${index + 1}`);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Provider: ${target.cloud_provider}`);
      doc.text(`Service: ${target.target_service}`);
      doc.text(`Engine: ${target.target_engine}`);
      doc.text(`Region: ${target.cloud_region}`);
      doc.moveDown();
    });
  }

  private addPDFCompatibilityAnalysis(doc: any, analysis: any): void {
    doc.fontSize(11).text(`Overall Compatibility Score: ${analysis?.overall_score}%`);
    doc.text(`Status: ${analysis?.status}`);
    doc.moveDown();
    doc.text('Feature Compatibility:');
    Object.entries(analysis?.feature_compatibility || {}).forEach(([feature, details]: [string, any]) => {
      doc.text(`  • ${feature}: ${details.status} (Score: ${details.score})`);
    });
  }

  private addPDFRiskAssessment(doc: any, risks: any): void {
    doc.fontSize(11).text(`Overall Risk Score: ${risks?.overall_score}`);
    doc.text(`Risk Level: ${risks?.overall_risk}`);
    doc.moveDown();
    doc.text('Risk Breakdown:');
    doc.text(`  • Compatibility Risk: ${risks?.compatibility_risk}`);
    doc.text(`  • Performance Risk: ${risks?.performance_risk}`);
    doc.text(`  • Data Loss Risk: ${risks?.data_loss_risk}`);
    doc.text(`  • Complexity Risk: ${risks?.complexity_risk}`);
  }

  private addPDFMigrationStrategy(doc: any, strategy: any): void {
    doc.fontSize(11).text(`Pattern: ${strategy?.migration_pattern}`);
    doc.text(`Approach: ${strategy?.migration_approach}`);
    doc.text(`Type: ${strategy?.migration_type}`);
    doc.moveDown();
    doc.text('Primary Tools:');
    strategy?.primary_tools?.forEach((tool: string) => {
      doc.text(`  • ${tool}`);
    });
  }

  private addPDFTimeline(doc: any, timeline: any): void {
    doc.fontSize(11).text(`Total Duration: ${timeline?.total_duration_days} days`);
    doc.text(`Total Phases: ${timeline?.total_phases}`);
    doc.moveDown();
    timeline?.phases?.forEach((phase: any) => {
      doc.text(`Phase ${phase.phase}: ${phase.name} (${phase.duration_days} days)`);
    });
  }

  private addPDFDetailedTimeline(doc: any, timeline: any): void {
    timeline?.phases?.forEach((phase: any) => {
      doc.fontSize(12).font('Helvetica-Bold').text(`Phase ${phase.phase}: ${phase.name}`);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Duration: ${phase.duration_days} days`);
      doc.text('Activities:');
      phase.activities?.forEach((activity: string) => {
        doc.text(`  • ${activity}`);
      });
      doc.moveDown();
    });
  }

  private addPDFResourceRequirements(doc: any, resources: any): void {
    doc.fontSize(11).text('Team Structure:');
    resources?.team_structure?.forEach((role: any) => {
      doc.text(`  • ${role.role}: ${role.count} person(s) at ${role.allocation}`);
    });
  }

  private addPDFCostEstimation(doc: any, costs: any): void {
    doc.fontSize(11).text(`Total Estimated Cost: $${costs?.total_estimated_cost?.toLocaleString()}`);
    doc.moveDown();
    doc.text('Cost Breakdown:');
    doc.text(`  • Team Cost: $${costs?.team_cost?.toLocaleString()}`);
    doc.text(`  • Infrastructure Cost: $${costs?.infrastructure_cost?.toLocaleString()}`);
    doc.text(`  • Tooling Cost: $${costs?.tooling_cost?.toLocaleString()}`);
    doc.text(`  • Contingency: $${costs?.contingency?.toLocaleString()}`);
  }

  private addPDFRecommendations(doc: any, recommendations: any[]): void {
    recommendations?.forEach((rec, index) => {
      doc.fontSize(11).text(`${index + 1}. ${rec}`);
      doc.moveDown(0.5);
    });
  }

  private addPDFCompatibilityDetails(doc: any, details: any): void {
    doc.fontSize(10).text(`Compatible Features: ${details?.compatible_features}`);
    doc.text(`Partial Features: ${details?.partial_features}`);
    doc.text(`Incompatible Features: ${details?.incompatible_features}`);
  }

  private addPDFDataTypeMappings(doc: any, mappings: any[]): void {
    mappings?.forEach((mapping: any) => {
      doc.fontSize(10).text(`${mapping.source_type} → ${mapping.target_type} (${mapping.mapping_type})`);
    });
  }

  private addPDFTransformationRules(doc: any, rules: any): void {
    doc.fontSize(10).text(`Schema Changes Required: ${rules?.schema_changes_required ? 'Yes' : 'No'}`);
    doc.text(`Data Type Conversions Required: ${rules?.data_type_conversions_required ? 'Yes' : 'No'}`);
    doc.text(`Code Refactoring Required: ${rules?.code_refactoring_required ? 'Yes' : 'No'}`);
  }

  private addPDFRiskDetails(doc: any, risks: any): void {
    doc.fontSize(10).text('Risk Factors:');
    risks?.risk_factors?.forEach((factor: string) => {
      doc.text(`  • ${factor}`);
    });
  }

  private addPDFExecutionSteps(doc: any, steps: any): void {
    ['pre_migration', 'migration', 'post_migration'].forEach(phase => {
      doc.fontSize(12).font('Helvetica-Bold').text(phase.replace('_', ' ').toUpperCase());
      doc.fontSize(10).font('Helvetica');
      steps[phase]?.forEach((step: any) => {
        doc.text(`Step ${step.step}: ${step.name}`);
        doc.text(`  Duration: ${step.estimated_duration}`);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    });
  }

  private addPDFRollbackPlan(doc: any, plan: any): void {
    doc.fontSize(11).text('Rollback Triggers:');
    plan?.rollback_triggers?.forEach((trigger: string) => {
      doc.text(`  • ${trigger}`);
    });
    doc.moveDown();
    doc.text(`Estimated Rollback Time: ${plan?.estimated_rollback_time}`);
  }

  private addPDFValidationPlan(doc: any, plan: any): void {
    plan?.validation_types?.forEach((type: any) => {
      doc.fontSize(11).font('Helvetica-Bold').text(type.type);
      doc.fontSize(10).font('Helvetica');
      doc.text(type.description);
      doc.moveDown(0.5);
    });
  }

  private addPDFCommunicationPlan(doc: any, plan: any): void {
    plan?.stakeholder_groups?.forEach((group: any) => {
      doc.fontSize(10).text(`${group.group}: ${group.communication_frequency} via ${group.communication_method}`);
    });
  }

  // ============================================================================
  // Helper Methods for Excel Generation
  // ============================================================================

  private addExcelSummary(sheet: any, data: any): void {
    sheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 50 },
    ];

    sheet.addRow({ metric: 'Project Name', value: data.project_name });
    sheet.addRow({ metric: 'Project ID', value: data.project_id });
    sheet.addRow({ metric: 'Status', value: data.status });
    sheet.addRow({ metric: 'Generated Date', value: new Date().toLocaleString() });
  }

  private addExcelSourceSystems(sheet: any, sources: any[]): void {
    sheet.columns = [
      { header: 'System Name', key: 'name', width: 25 },
      { header: 'Type', key: 'type', width: 20 },
      { header: 'Version', key: 'version', width: 15 },
      { header: 'Size (GB)', key: 'size', width: 15 },
      { header: 'Workload', key: 'workload', width: 15 },
    ];

    sources?.forEach(source => {
      sheet.addRow({
        name: source.system_name,
        type: source.system_type,
        version: source.system_version,
        size: source.database_size_gb,
        workload: source.workload_type,
      });
    });
  }

  private addExcelTargetPlatforms(sheet: any, targets: any[]): void {
    sheet.columns = [
      { header: 'Provider', key: 'provider', width: 15 },
      { header: 'Service', key: 'service', width: 30 },
      { header: 'Engine', key: 'engine', width: 20 },
      { header: 'Region', key: 'region', width: 20 },
    ];

    targets?.forEach(target => {
      sheet.addRow({
        provider: target.cloud_provider,
        service: target.target_service,
        engine: target.target_engine,
        region: target.cloud_region,
      });
    });
  }

  private addExcelCompatibility(sheet: any, analysis: any): void {
    sheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 20 },
    ];

    sheet.addRow({ metric: 'Overall Score', value: `${analysis?.overall_score}%` });
    sheet.addRow({ metric: 'Status', value: analysis?.status });
    sheet.addRow({ metric: 'Compatible Features', value: analysis?.compatible_features });
    sheet.addRow({ metric: 'Partial Features', value: analysis?.partial_features });
    sheet.addRow({ metric: 'Incompatible Features', value: analysis?.incompatible_features });
  }

  private addExcelRiskAssessment(sheet: any, risks: any): void {
    sheet.columns = [
      { header: 'Risk Category', key: 'category', width: 25 },
      { header: 'Level', key: 'level', width: 15 },
    ];

    sheet.addRow({ category: 'Overall Risk', level: risks?.overall_risk });
    sheet.addRow({ category: 'Compatibility Risk', level: risks?.compatibility_risk });
    sheet.addRow({ category: 'Performance Risk', level: risks?.performance_risk });
    sheet.addRow({ category: 'Data Loss Risk', level: risks?.data_loss_risk });
    sheet.addRow({ category: 'Complexity Risk', level: risks?.complexity_risk });
  }

  private addExcelTimeline(sheet: any, timeline: any): void {
    sheet.columns = [
      { header: 'Phase', key: 'phase', width: 10 },
      { header: 'Name', key: 'name', width: 35 },
      { header: 'Duration (days)', key: 'duration', width: 15 },
      { header: 'Critical Path', key: 'critical', width: 15 },
    ];

    timeline?.phases?.forEach((phase: any) => {
      sheet.addRow({
        phase: phase.phase,
        name: phase.name,
        duration: phase.duration_days,
        critical: phase.critical_path ? 'Yes' : 'No',
      });
    });
  }

  private addExcelCostEstimation(sheet: any, costs: any): void {
    sheet.columns = [
      { header: 'Cost Category', key: 'category', width: 30 },
      { header: 'Amount (USD)', key: 'amount', width: 20 },
    ];

    sheet.addRow({ category: 'Team Cost', amount: costs?.team_cost });
    sheet.addRow({ category: 'Infrastructure Cost', amount: costs?.infrastructure_cost });
    sheet.addRow({ category: 'Tooling Cost', amount: costs?.tooling_cost });
    sheet.addRow({ category: 'Contingency', amount: costs?.contingency });
    sheet.addRow({ category: 'Total', amount: costs?.total_estimated_cost });
  }

  private addExcelMappingOverview(sheet: any, data: any): void {
    sheet.columns = [
      { header: 'Attribute', key: 'attribute', width: 30 },
      { header: 'Value', key: 'value', width: 50 },
    ];

    sheet.addRow({ attribute: 'Mapping ID', value: data.mapping_id });
    sheet.addRow({ attribute: 'Source System', value: data.source.system_name });
    sheet.addRow({ attribute: 'Target Platform', value: data.target.target_service });
    sheet.addRow({ attribute: 'Compatibility Score', value: `${data.compatibility_score}%` });
    sheet.addRow({ attribute: 'Risk Level', value: data.overall_risk });
  }

  private addExcelDataTypeMappings(sheet: any, mappings: any[]): void {
    sheet.columns = [
      { header: 'Source Type', key: 'source', width: 20 },
      { header: 'Target Type', key: 'target', width: 20 },
      { header: 'Mapping Type', key: 'type', width: 15 },
      { header: 'Conversion', key: 'conversion', width: 40 },
    ];

    mappings?.forEach(mapping => {
      sheet.addRow({
        source: mapping.source_type,
        target: mapping.target_type,
        type: mapping.mapping_type,
        conversion: mapping.conversion_function,
      });
    });
  }

  private addExcelSchemaMappings(sheet: any, mappings: any[]): void {
    sheet.columns = [
      { header: 'Source Schema', key: 'source_schema', width: 20 },
      { header: 'Source Table', key: 'source_table', width: 25 },
      { header: 'Target Schema', key: 'target_schema', width: 20 },
      { header: 'Target Table', key: 'target_table', width: 25 },
      { header: 'Mapping Type', key: 'type', width: 15 },
    ];

    mappings?.forEach(mapping => {
      sheet.addRow({
        source_schema: mapping.source_schema_name,
        source_table: mapping.source_table_name,
        target_schema: mapping.target_schema_name,
        target_table: mapping.target_table_name,
        type: mapping.mapping_type,
      });
    });
  }

  private addExcelTransformations(sheet: any, rules: any): void {
    sheet.columns = [
      { header: 'Transformation Type', key: 'type', width: 25 },
      { header: 'Required', key: 'required', width: 15 },
      { header: 'Details', key: 'details', width: 50 },
    ];

    sheet.addRow({
      type: 'Schema Changes',
      required: rules?.schema_changes_required ? 'Yes' : 'No',
      details: 'Schema transformation details',
    });
    sheet.addRow({
      type: 'Data Type Conversions',
      required: rules?.data_type_conversions_required ? 'Yes' : 'No',
      details: 'Data type conversion details',
    });
    sheet.addRow({
      type: 'Code Refactoring',
      required: rules?.code_refactoring_required ? 'Yes' : 'No',
      details: 'Code refactoring details',
    });
  }

  // ============================================================================
  // Data Fetching Methods (Mock implementations)
  // ============================================================================

  private async fetchProjectData(projectId: string): Promise<any> {
    // Mock implementation - replace with actual database queries
    return {
      project_id: projectId,
      project_name: 'Sample Migration Project',
      status: 'in_progress',
      executive_summary: 'This is a comprehensive migration project...',
      key_metrics: {
        'Total Sources': 5,
        'Total Targets': 3,
        'Compatibility Score': '82%',
        'Risk Level': 'Medium',
      },
      source_systems: [],
      target_platforms: [],
      compatibility_analysis: {},
      risk_assessment: {},
      migration_strategy: {},
      timeline: {},
      resource_plan: {},
      cost_estimation: {},
      recommendations: [],
    };
  }

  private async fetchMappingData(mappingId: string): Promise<any> {
    return {
      mapping_id: mappingId,
      source: {},
      target: {},
      compatibility_score: 78,
      compatibility_details: {},
      data_type_mappings: [],
      schema_mappings: [],
      transformation_rules: {},
      risk_details: {},
    };
  }

  private async fetchCompatibilityData(projectId: string): Promise<any> {
    return {
      project_id: projectId,
      compatibility_analysis: {},
    };
  }

  private async fetchMigrationPlanData(planId: string): Promise<any> {
    return {
      plan_id: planId,
      plan_name: 'Migration Plan',
      plan_version: '1.0',
      strategy: {},
      timeline: {},
      execution_steps: {},
      rollback_plan: {},
      validation_plan: {},
      communication_plan: {},
    };
  }

  private async fetchExecutiveSummaryData(projectId: string): Promise<any> {
    return {
      project_id: projectId,
      summary: {},
    };
  }

  private async generateCompatibilityPDF(data: any): Promise<string> {
    return 'compatibility-report.pdf';
  }

  private async generateExecutiveSummaryPDF(data: any): Promise<string> {
    return 'executive-summary.pdf';
  }
}

// Made with Bob
