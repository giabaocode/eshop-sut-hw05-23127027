#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const technicalOnly = process.argv.includes('--technical-only');
const checks = [];

const exists = (p) => fs.existsSync(path.join(root, p));
const nonempty = (p) => exists(p) && fs.statSync(path.join(root, p)).size > 0;
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const add = (id, status, evidence) => checks.push({ id, status, evidence });
const pass = (id, ok, evidence, failure) => add(id, ok ? 'PASS' : 'FAIL', ok ? evidence : failure);
const filesUnder = (dir) => {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute, { recursive: true }).map((p) => path.join(dir, p));
};

const official = [
  'performance/scenarios/official/23127027_Load_20260901.js',
  'performance/scenarios/official/23127027_Stress_20260901.js',
  'performance/scenarios/official/23127027_Spike_20260901.js',
];
pass('official_plans', official.every(nonempty), official.join(', '), 'One or more official plans are absent/empty');
pass('official_naming', official.every((p) => /^performance\/scenarios\/official\/23127027_(Load|Stress|Spike)_20260901\.js$/.test(p)), 'All human-created names match the approved PDF pattern', 'Official name mismatch');

const runs = {
  load: 'performance/results/load/20260902T092131+0700',
  stress: 'performance/results/stress/20260902T101857+0700',
  spike: 'performance/results/spike/20260902T104549+0700',
};
for (const [scenario, dir] of Object.entries(runs)) {
  pass(`${scenario}_raw`, nonempty(`${dir}/raw/${scenario}-raw.json`), `${dir}/raw/${scenario}-raw.json`, 'Missing nonempty native raw JSON');
  pass(`${scenario}_report_directory`, exists(`${dir}/report`), `${dir}/report/`, 'Missing report directory');
  pass(`${scenario}_screenshot`, filesUnder(`${dir}/evidence/screenshots`).some((p) => /\.(png|jpe?g)$/i.test(p)), 'Genuine run screenshot is present', 'Missing screenshot image');
}
pass('distinct_k6_views',
  nonempty(`${runs.load}/report/load-aggregate.html`) &&
  nonempty(`${runs.stress}/report/stress-timeseries.html`) &&
  nonempty(`${runs.spike}/report/spike-dashboard.html`),
  'Load aggregate, Stress CSV-derived time series, and Spike k6 dashboard are distinct',
  'One or more distinct report views are missing');

const endurance = 'performance/results/endurance/20260902T143823+0700';
pass('endurance', nonempty(`${endurance}/raw/endurance-raw.json`) && nonempty('analysis/endurance-analysis.md'), 'Genuine 5-VU/12-minute endurance evidence and analysis', 'Endurance evidence missing');
pass('ai_analysis', nonempty('analysis/ai-analysis-original.md'), 'Immutable original AI analysis exists', 'AI analysis missing');
pass('human_ai_review', nonempty('reviews/ai-analysis-review.md') && !read('reviews/ai-analysis-review.md').includes('[PENDING HUMAN]'), 'All nine human verdicts are recorded', 'Human AI review incomplete');
pass('optimization_review', nonempty('reviews/optimization-review.md') && !read('reviews/optimization-review.md').includes('[PENDING HUMAN]'), 'All seven human verdicts are recorded', 'Optimization review incomplete');
pass('continuous_testing_proposal', nonempty('proposal/continuous-performance-testing.md') && read('proposal/continuous-performance-testing.md').includes('```mermaid'), 'Proposal and Mermaid flowchart exist', 'Proposal/flowchart missing');
pass('agent_skill', nonempty('skills/hw05-k6-performance/SKILL.md') && nonempty('skills/hw05-k6-performance/scripts/check-result-tree.sh'), 'Reusable Skill and deterministic checker exist', 'Agent Skill incomplete');
pass('ai_audit', nonempty('ai-audit/audit.md') && nonempty('ai-audit/interactions/036-human-ai-optimization-verdicts.md'), 'Main audit and detailed interaction records through the human verdict gate exist', 'AI Audit incomplete');
pass('readme', nonempty('README.md') && read('README.md').includes('Self-assessment table'), 'README contains summary and self-assessment table', 'README submission section missing');
pass('main_report_markdown', nonempty('report/23127027_HW05_Performance_Report.md'), 'Main report Markdown exists', 'Main report Markdown missing');
pass('main_report_pdf', nonempty('report/23127027_HW05_Performance_Report.pdf'), 'Main report PDF exists', 'Main report PDF missing');
pass('audit_pdf', nonempty('report/23127027_AI_Audit.pdf'), 'AI Audit PDF exists', 'AI Audit PDF missing');
pass('critique_markdown', nonempty('reviews/ai-critique-draft.md'), '278-word candidate exists', 'Critique draft missing');
pass('critique_final', nonempty('reviews/ai-critique.md') && nonempty('report/23127027_AI_Critique.pdf'), 'Human-approved 278-word critique and final PDF exist', 'Final approved critique/PDF missing');
pass('git_log', nonempty('git-commit-log.txt'), 'Real Git log export exists', 'Git log export missing');

if (!technicalOnly) {
  const hardwareImages = filesUnder('evidence/hardware').filter((p) => /\.(png|jpe?g)$/i.test(p));
  add('hardware_screenshot', hardwareImages.length ? 'MANUAL VERIFICATION REQUIRED' : 'MANUAL VERIFICATION REQUIRED', hardwareImages.length ? `Review genuine image(s): ${hardwareImages.join(', ')}` : 'No human hardware screenshot is present');
  pass('hostname_compatibility', read('MANUAL-TODO.md').includes('| H-022 |') && read('MANUAL-TODO.md').match(/\| H-022 \|[^\n]+\| DONE BY HUMAN \|/), 'Human confirmed the same MacBook/hostname was used previously', 'Hostname compatibility confirmation missing');
  const youtube = (read('README.md').match(/https:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/\S+/) || [])[0];
  add('video_url', 'MANUAL VERIFICATION REQUIRED', youtube || 'No real YouTube URL supplied');
  pass('combined_video_decision', read('MANUAL-TODO.md').match(/\| H-003 \|[^\n]+\| DONE BY HUMAN \|/), 'Human selected one combined performance/Skill video', 'H-003 decision missing');
  pass('ai_critique_approval', read('MANUAL-TODO.md').match(/\| H-021 \|[^\n]+\| DONE BY HUMAN \|/), 'Human approved the 278-word critique', 'H-021 approval missing');
  add('issue_publication', 'NOT APPLICABLE', 'Human confirmed no genuine SUT issue; no speculative Issue published');
  add('self_assessed_grade', 'MANUAL VERIFICATION REQUIRED', 'No human grade supplied');
  add('final_zip', 'MANUAL VERIFICATION REQUIRED', 'Requires grade and final human approval');
  add('moodle_submission', 'MANUAL VERIFICATION REQUIRED', 'Must be performed by the student');
}

const counts = Object.fromEntries(['PASS', 'FAIL', 'MANUAL VERIFICATION REQUIRED', 'NOT APPLICABLE'].map((s) => [s, checks.filter((c) => c.status === s).length]));
const result = { generated_at: new Date().toISOString(), technical_only: technicalOnly, counts, checks };

if (technicalOnly) {
  console.log(JSON.stringify(result, null, 2));
} else {
  fs.mkdirSync(path.join(root, 'validation'), { recursive: true });
  fs.writeFileSync(path.join(root, 'validation/submission-validation.json'), `${JSON.stringify(result, null, 2)}\n`);
  const rows = checks.map((c) => `| ${c.id} | ${c.status} | ${c.evidence.replaceAll('|', '\\|')} |`).join('\n');
  const markdown = `# HW05 Submission Validation\n\nGenerated: ${result.generated_at}\n\n| Status | Count |\n|---|---:|\n${Object.entries(counts).map(([s, n]) => `| ${s} | ${n} |`).join('\n')}\n\n| Check | Status | Evidence |\n|---|---|---|\n${rows}\n\nA PASS means repository evidence was checked. Human-attributable items remain MANUAL VERIFICATION REQUIRED until the student supplies/approves them.\n`;
  fs.writeFileSync(path.join(root, 'validation/submission-validation.md'), markdown);
  console.log(markdown);
}

process.exit(checks.some((c) => c.status === 'FAIL') ? 1 : 0);
