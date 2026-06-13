#!/usr/bin/env node
// scripts/apply_templates.js
// Apply templates from /templates into docs pages (topics, courses, home)
// Usage: node scripts/apply_templates.js [--dry-run] [--apply] [--force] [--course=ID] [--topic=path]
//        --dry-run (default): just report what would change
//        --apply: actually write files
//        --force: overwrite even if target exists
//        --course=ID: restrict to a single course folder name
//        --topic=PATH: restrict to a single topic folder path (relative to repo root)

const fs = require('fs');
const path = require('path');
const child = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const templatesDir = path.join(repoRoot, 'templates');
const docsDir = path.join(repoRoot, 'docs');
const coursesRootCandidate = path.join(docsDir, 'courses');

function exists(p){ try { return fs.existsSync(p); } catch(e){ return false; } }
function isDir(p){ try { return fs.statSync(p).isDirectory(); } catch(e){ return false; } }

function findCoursesRoot(){ if (isDir(coursesRootCandidate)) return coursesRootCandidate; function walk(dir){ const items = fs.readdirSync(dir, { withFileTypes: true }); for (const it of items){ if (it.isDirectory()){ if (it.name.toLowerCase() === 'courses') return path.join(dir, it.name); const found = walk(path.join(dir, it.name)); if (found) return found; } } return null; } try { return walk(repoRoot); } catch(e){ return null; } }

function readFileUtf(p){ return fs.readFileSync(p, 'utf8'); }
function writeFileUtf(p, content){ fs.mkdirSync(path.dirname(p), { recursive:true }); fs.writeFileSync(p, content, 'utf8'); }

function loadTemplate(name){ const p = path.join(templatesDir, name + '.template.html'); if (!exists(p)) throw new Error('Template not found: ' + p); return readFileUtf(p); }

function inferTitleFromHtml(filePath){ try{ const txt = readFileUtf(filePath); const m = txt.match(/<title>([^<]+)<\/title>/i); if (m) return m[1].trim(); const h = txt.match(/<h1[^>]*>([^<]+)<\/h1>/i); if (h) return h[1].trim(); }catch(e){} return null; }

function humanizeSlug(slug){ // '01-intro' -> 'Intro' or 'intro' -> 'Intro'
  const parts = slug.split('-').slice(1); // remove numeric prefix
  if (!parts.length) return slug;
  return parts.map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(' ');
}

function computeQuizIncludeForTopic(topicFolder){ // topicFolder absolute path to topic folder
  // want relative path from topic folder to docs/quiz.js
  const quizAbs = path.join(docsDir, 'quiz.js');
  const rel = path.relative(topicFolder, quizAbs).replace(/\\/g, '/');
  return `<script src="${rel}"></script>`;
}

function renderTemplateString(tpl, replacements){ return tpl.replace(/{{\s*([A-Z0-9_]+)\s*}}/g, (_, k)=> (k in replacements ? replacements[k] : '')); }

function applyTopicTemplate(coursePath, topicName, topicsList, options){
  const topicFolder = path.join(coursePath, topicName);
  const tpl = loadTemplate('topic');
  // derive values
  const parts = topicName.split('-');
  const number = parts[0];
  const slug = parts.slice(1).join('-') || topicName;
  // try to find an existing title in index.html if present
  const indexPath = path.join(topicFolder, 'index.html');
  let title = null;
  if (exists(indexPath)) title = inferTitleFromHtml(indexPath);
  if (!title) title = `${number} - ${humanizeSlug(topicName)}`;

  // compute prev/next
  const idx = topicsList.indexOf(topicName);
  const prev = idx > 0 ? topicsList[idx-1] : '../index.html';
  const next = idx >=0 && idx < topicsList.length-1 ? topicsList[idx+1] : '../index.html';

  const quizInclude = computeQuizIncludeForTopic(topicFolder);

  const replacements = {
    TOPIC_NUMBER: number,
    TOPIC_SLUG: slug,
    TOPIC_TITLE: title,
    PREV_FOLDER: prev,
    NEXT_FOLDER: next
  };

  let out = renderTemplateString(tpl, replacements);
  // Replace QUIZ_ENGINE_INCLUDE placeholder if present
  if (out.indexOf('<!-- QUIZ_ENGINE_INCLUDE -->') !== -1){
    out = out.replace('<!-- QUIZ_ENGINE_INCLUDE -->', quizInclude);
  } else {
    // also replace any existing hard-coded script pointing to quiz.js with the computed relative path
    out = out.replace(/<script[^>]*src=["'][^"']*quiz\.js["'][^>]*><\/script>/i, quizInclude);
  }

  return { indexPath, content: out };
}

function applyCourseTemplate(coursePath, topicsList, options){
  const tpl = loadTemplate('course');
  const courseId = path.basename(coursePath);
  const courseIndexPath = path.join(coursePath, 'index.html');
  let courseTitle = inferTitleFromHtml(courseIndexPath) || (courseId.charAt(0).toUpperCase()+courseId.slice(1));
  // try to read course.json for description
  let courseDescription = '';
  const courseJsonPath = path.join(coursePath, 'course.json');
  if (exists(courseJsonPath)){
    try{ const cj = JSON.parse(readFileUtf(courseJsonPath)); courseTitle = cj.title || courseTitle; courseDescription = cj.description || '';}catch(e){}
  }

  // Build topics HTML to inject into {{TOPICS}}
  const topicsHtml = topicsList.map(t => {
    const p = path.join(path.relative(coursePath, path.join(coursePath, t))).replace(/\\/g, '/');
    // link to folder (index.html)
    return `<div class="topic-item"><div class="topic-title"><a href="${t}/">${t}</a></div></div>`;
  }).join('\n');

  const replacements = { COURSE_ID: courseId, COURSE_TITLE: courseTitle, COURSE_DESCRIPTION: courseDescription, TOPICS: topicsHtml };
  const out = renderTemplateString(tpl, replacements);
  return { indexPath: courseIndexPath, content: out };
}

function applyHomeTemplate(options){
  const tpl = loadTemplate('home');
  const out = tpl; // home template already contains dynamic fetch of docs/courses.json
  const indexPath = path.join(docsDir, 'index.html');
  return { indexPath, content: out };
}

function safeWrite(targetPath, content, opts){
  const { dryRun, force } = opts;
  const existsAlready = exists(targetPath);
  if (!existsAlready){
    if (!dryRun) writeFileUtf(targetPath, content);
    return { wrote: !dryRun, reason: 'new' };
  }
  // exists — compare
  const old = readFileUtf(targetPath);
  if (old === content){ return { wrote: false, reason: 'identical' }; }
  if (!force){ return { wrote: false, reason: 'differs (use --force to overwrite)' }; }
  // force write: back up existing
  if (!dryRun){ fs.copyFileSync(targetPath, targetPath + '.bak'); writeFileUtf(targetPath, content); }
  return { wrote: !dryRun, reason: 'overwritten' };
}

function runScanner(){ try{ child.execSync('node scripts/scan_courses.js', { stdio:'inherit' }); }catch(e){ console.error('Failed to run scanner:', e && e.message); } }

function cli(){
  const argv = process.argv.slice(2);
  const opts = { dryRun: true, apply: false, force: false, course: null, topic: null };
  argv.forEach(a=>{ if (a === '--apply') { opts.dryRun = false; opts.apply = true; } else if (a === '--dry-run') { opts.dryRun = true; opts.apply = false; } else if (a === '--force') { opts.force = true; } else if (a.startsWith('--course=')) { opts.course = a.split('=')[1]; } else if (a.startsWith('--topic=')) { opts.topic = a.split('=')[1]; } });

  const coursesRoot = findCoursesRoot();
  if (!coursesRoot){ console.error('Courses root not found (expected docs/courses). Aborting.'); process.exit(2); }

  const courseDirs = fs.readdirSync(coursesRoot, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort();
  const report = { jobs: [] };

  for (const courseName of courseDirs){ if (opts.course && opts.course !== courseName) continue; const coursePath = path.join(coursesRoot, courseName);
    // enumerate topic folders NN-slug
    const topics = fs.readdirSync(coursePath, { withFileTypes: true }).filter(d => d.isDirectory() && /^\d{2}-/.test(d.name)).map(d=>d.name).sort();
    // apply course template
    try{
      const courseJob = { course: courseName, changed: [] };
      const ctpl = applyCourseTemplate(coursePath, topics, opts);
      const resCourse = safeWrite(ctpl.indexPath, ctpl.content, { dryRun: opts.dryRun, force: opts.force });
      courseJob.changed.push({ file: path.relative(repoRoot, ctpl.indexPath), result: resCourse });

      // topics
      for (const t of topics){ if (opts.topic && !path.normalize(opts.topic).endsWith(path.join(courseName, t))) continue; const tplRes = applyTopicTemplate(coursePath, t, topics, opts); const res = safeWrite(tplRes.indexPath, tplRes.content, { dryRun: opts.dryRun, force: opts.force }); courseJob.changed.push({ file: path.relative(repoRoot, tplRes.indexPath), result: res }); }

      report.jobs.push(courseJob);
    }catch(e){ report.jobs.push({ course: courseName, error: e && e.message }); }
  }

  // home
  try{ const home = applyHomeTemplate(opts); const resHome = safeWrite(home.indexPath, home.content, { dryRun: opts.dryRun, force: opts.force }); report.home = { file: path.relative(repoRoot, home.indexPath), result: resHome }; }catch(e){ report.home = { error: e && e.message }; }

  // Summary output
  console.log('\n==== apply_templates summary ===\n');
  report.jobs.forEach(j=>{ console.log('Course:', j.course); if (j.error) console.log('  ERROR:', j.error); else j.changed.forEach(c=>{ console.log('  ', c.file, '->', c.result.reason, c.result.wrote ? '(written)' : '' ); }); });
  if (report.home) console.log('Home:', report.home.file, '->', report.home.result ? report.home.result.reason : report.home.error );

  if (!opts.dryRun && opts.apply){ console.log('\nRunning scanner to refresh course metadata (docs/courses.json, course.json)...'); runScanner(); }

  // write machine-readable report
  const outReport = path.join(repoRoot, 'scripts', 'apply-templates-report.json');
  try{ fs.writeFileSync(outReport, JSON.stringify(report, null, 2), 'utf8'); console.log('Wrote report to', outReport); }catch(e){ console.error('Failed to write report:', e && e.message); }

  console.log('\nDone.');
}

if (require.main === module) cli();
