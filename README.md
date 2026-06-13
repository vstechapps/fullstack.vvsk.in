# fullstack.vvsk.in
Gamified Fullstack Learning Platform

## Overview
`fullstack.vvsk.in` is a professional learning platform for fullstack technologies. The repository is organized as a static content-driven course platform where each course contains ordered topics and an optional quiz per topic. The structure and metadata are intentionally simple so automation (including AI tools) can generate, validate, and extend content programmatically.

Key highlights

## Project structure (abstract)

Top-level layout (important files/folders):

	- `index.html` - main landing page that guides users to courses, paths, and projects
	- `quiz.js` - client-side quiz engine: loads `quiz.json`, renders a quiz modal, evaluates score and shows pass/fail (80% pass threshold)
	- `courses/` - directory containing one folder per course
		- `<course-name>/` (e.g. `java/`, `angular/`, `react/`)
			- `index.html` - course overview and navigation to topic pages
			- `01-intro/`, `02-install/`, ... - topic folders ordered by numeric prefix (01..99)
				- `index.html` - topic content (theory). These pages import `quiz.js` from the `docs` root or relative origin.
				- `quiz.json` - optional: quiz payload for this topic

Example tree (simplified):

```
docs/
	index.html
	quiz.js
	courses/
		java/
			index.html
			01-intro/
				index.html
				quiz.json
			02-install/
				index.html
		angular/
		react/
```

## Content & conventions


### Topic template

To keep topic pages consistent, a canonical template is provided at the repository root: `topic.template.html`. AI or automation creating new topics should:

Template usage notes (content guidance):

Automation should validate the resulting `index.html` contains a heading (`<h1>`), a link back to the course index, and that any image references exist in the topic folder.

### Course landing page template

For consistent course landing pages, a canonical template is provided at the repository root: `course-template.html`.
AI or automation creating a new course should:

Example `course.json` use:

### Home / Landing page template

A canonical home/landing page template lives at `home-template.html` in the repository root. Use it to regenerate `docs/index.html` when courses change.

How to use:

Automation note: AI should reference `home-template.html` when updating `docs/index.html` so the home page stays consistent with available courses and metadata.

## Data contract: `quiz.json`

AI and automation should rely on a small, stable JSON schema for topic quizzes. Example schema (required fields):

```
{
	"title": "Quiz: Introduction to Java",
	"timeLimitSeconds": 0,        // optional, 0 or missing means no limit
	"shuffleQuestions": true,     // optional
	"questions": [
		{
			"id": "q1",
			"type": "single" ,        // or "multiple"
			"question": "Which keyword declares a class in Java?",
			"options": [
				{ "id": "a", "text": "class" },
				{ "id": "b", "text": "struct" },
				{ "id": "c", "text": "module" }
			],
			"correctOptions": ["a"],
			"explanation": "Use `class` to declare a class in Java."
		}
	]
}
```

Contract notes for AI:

## How to add a course/topic (recommended steps)

1. Create a folder under `docs/courses/<course-name>/`.
2. Add `index.html` for the course overview and navigation.
3. Add ordered topic folders using `01-...`, `02-...` naming.
4. Put topic content in `index.html` inside each topic folder.
5. If the topic needs an assessment, add `quiz.json` following the schema above.
6. Update `docs/index.html` navigation (or use automation to regenerate it).

## How AI can help (practical tasks)


Example `course.json` (optional, recommended):

```
{
	"id": "java",
	"title": "Java - Core and Advanced",
	"description": "Fundamentals to advanced Java programming",
	"topics": [
		{ "id": "01-intro", "title": "Introduction", "path": "01-intro/" },
		{ "id": "02-install", "title": "Installation", "path": "02-install/" }
	]
}
```

## Minimal developer/dev-server notes


## Edge cases and validation checks for automation


## Quick checklist for PRs that automation/AI should follow


Templates: moved to `templates/` directory as `topic.template.html`, `course.template.html`, `home.template.html`.
When using these templates to generate pages under `docs/`, ensure the quiz engine path is correct — topic pages typically need the quiz engine at `../../../quiz.js`. The `templates/topic.template.html` contains a placeholder comment `<!-- QUIZ_ENGINE_INCLUDE -->` so automation can replace it with the correct relative script tag when copying the template into `docs/courses/<course>/<topic>/index.html`.
- Generate `quiz.json` files for topics that are missing quizzes, using the schema above.
