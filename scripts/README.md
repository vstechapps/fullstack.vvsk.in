Scan scripts for courses and quizzes

Files:
- `scan_courses.js` - Node script that:
  - finds the `docs/courses` folder (or any `courses` folder under the repo)
  - scans each course and topic
  - validates `quiz.json` files against a small schema
  - writes/updates `course.json` per course
  - produces `scan-report.json` in the `scripts/` folder

Usage:
Ensure Node.js is installed. From repository root run:

```
node scripts/scan_courses.js
```

The script is intentionally simple and has no external dependencies.
