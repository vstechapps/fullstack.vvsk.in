#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const docsCourses = path.join(repoRoot, 'docs', 'courses');

function exists(p) {
  try { return fs.existsSync(p); } catch (e) { return false; }
}

function isDir(p) {
  try { return fs.statSync(p).isDirectory(); } catch (e) { return false; }
}

function findCoursesRoot() {
  if (isDir(docsCourses)) return docsCourses;
  // fallback: search for any folder named 'courses' in repo
  function walk(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const it of items) {
      if (it.isDirectory()) {
        if (it.name.toLowerCase() === 'courses') return path.join(dir, it.name);
        const found = walk(path.join(dir, it.name));
        if (found) return found;
      }
    }
    return null;
  }
  try { return walk(repoRoot); } catch (e) { return null; }
}

function readTitleFromHtml(filePath) {
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    const m = txt.match(/<title>([^<]+)<\/title>/i);
    if (m) return m[1].trim();
    const h1 = txt.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (h1) return h1[1].trim();
  } catch (e) {}
  return null;
}

function readTitleFromMarkdown(filePath) {
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    const m = txt.match(/^\s*#\s+(.+)$/m);
    if (m) return m[1].trim();
  } catch (e) {}
  return null;
}

function validateQuizJson(q, filePath) {
  const errors = [];
  if (!q || typeof q !== 'object') {
    errors.push('Quiz is not an object');
    return errors;
  }
  if (!Array.isArray(q.questions) || q.questions.length === 0) {
    errors.push('Missing or empty questions array');
    return errors;
  }
  q.questions.forEach((qq, idx) => {
    const prefix = `questions[${idx}]`;
    if (!qq.id) errors.push(`${prefix}: missing id`);
    if (!qq.type || (qq.type !== 'single' && qq.type !== 'multiple')) errors.push(`${prefix}: invalid or missing type`);
    if (!qq.question) errors.push(`${prefix}: missing question text`);
    if (!Array.isArray(qq.options) || qq.options.length === 0) errors.push(`${prefix}: missing or empty options`);
    else {
      const optionIds = new Set(qq.options.map(o => o.id));
      if (!Array.isArray(qq.correctOptions) || qq.correctOptions.length === 0) errors.push(`${prefix}: missing correctOptions`);
      else {
        qq.correctOptions.forEach(co => {
          if (!optionIds.has(co)) errors.push(`${prefix}: correctOptions references unknown option id '${co}'`);
        });
        if (qq.type === 'single' && qq.correctOptions.length !== 1) errors.push(`${prefix}: type 'single' must have exactly one correctOptions entry`);
      }
    }
  });
  return errors;
}

function scan() {
  const root = findCoursesRoot();
  const report = { scannedAt: new Date().toISOString(), coursesRoot: root || null, courses: [] };
  if (!root) {
    console.log('No courses folder found in repository (expected docs/courses).');
    fs.writeFileSync(path.join(__dirname, 'scan-report.json'), JSON.stringify(report, null, 2));
    return report;
  }

  const courseDirs = fs.readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
  for (const courseName of courseDirs) {
    const coursePath = path.join(root, courseName);
    const courseIndex = path.join(coursePath, 'index.html');
    const courseTitle = exists(courseIndex) ? readTitleFromHtml(courseIndex) || courseName : courseName;

    // find topic folders with numeric prefix
    const topics = (fs.readdirSync(coursePath, { withFileTypes: true })
      .filter(d => d.isDirectory() && /^\d{2}-/.test(d.name))
      .map(d => d.name))
      .sort();

    const topicsMeta = [];
    const courseReport = { id: courseName, title: courseTitle, path: path.relative(repoRoot, coursePath), topics: [] };

    for (const t of topics) {
      const tPath = path.join(coursePath, t);
      const tIndex = path.join(tPath, 'index.html');
      const mdPath = path.join(tPath, 'topic.md');
      let tTitle = null;
      if (exists(mdPath)) {
        tTitle = readTitleFromMarkdown(mdPath);
      }
      if (!tTitle && exists(tIndex)) {
        tTitle = readTitleFromHtml(tIndex);
      }
      if (!tTitle) {
        tTitle = t;
      }
      const quizPath = path.join(tPath, 'quiz.json');
      const topicMeta = { id: t, title: tTitle, path: path.relative(repoRoot, tPath), quiz: exists(quizPath) ? path.relative(repoRoot, quizPath) : null, quizErrors: [] };
      if (exists(quizPath)) {
        try {
          const raw = fs.readFileSync(quizPath, 'utf8');
          const q = JSON.parse(raw);
          const errs = validateQuizJson(q, quizPath);
          if (errs.length) topicMeta.quizErrors = errs;
        } catch (e) {
          topicMeta.quizErrors.push('Invalid JSON: ' + (e && e.message));
        }
      }
      courseReport.topics.push(topicMeta);
    }

    // write course.json
    const courseJson = { id: courseName, title: courseTitle, description: '', topics: courseReport.topics.map(t => ({ id: t.id, title: t.title, path: t.path })) };
    const courseJsonPath = path.join(coursePath, 'course.json');
    try {
      let write = true;
      if (exists(courseJsonPath)) {
        const old = JSON.parse(fs.readFileSync(courseJsonPath, 'utf8'));
        if (JSON.stringify(old, null, 2) === JSON.stringify(courseJson, null, 2)) write = false;
      }
      if (write) fs.writeFileSync(courseJsonPath, JSON.stringify(courseJson, null, 2));
      courseReport.courseJsonWritten = write;
    } catch (e) {
      courseReport.courseJsonError = (e && e.message) || String(e);
    }

    report.courses.push(courseReport);
  }
  // write per-repo scan report
  fs.writeFileSync(path.join(__dirname, 'scan-report.json'), JSON.stringify(report, null, 2));
  console.log('Scan complete. Report written to scripts/scan-report.json');

  // generate docs/courses.json that lists courses (without topics)
  try {
    const docsDir = path.join(repoRoot, 'docs');
    if (!exists(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
    const coursesSummary = report.courses.map(c => ({ id: c.id, title: c.title, path: c.path }));
    const coursesJsonPath = path.join(docsDir, 'courses.json');
    fs.writeFileSync(coursesJsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), courses: coursesSummary }, null, 2));
    console.log('Wrote docs/courses.json');
  } catch (e) {
    console.error('Failed to write docs/courses.json:', e && e.message);
  }
  return report;
}

if (require.main === module) {
  try { scan(); } catch (e) { console.error('Scan failed:', e); process.exitCode = 2; }
}
