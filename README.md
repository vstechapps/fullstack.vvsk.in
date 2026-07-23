# thefullstack.in

Gamified Fullstack Learning Platform

The Fullstack platform is a modern, content-driven learning experience for building practical fullstack skills through guided courses, structured topics, and interactive assessments. The project now runs as an Angular application while preserving the original educational content model.

## What this project offers

- A polished learning experience for fullstack development topics
- Course-based navigation for structured study paths
- A scalable content structure for adding new lessons and quizzes
- An Angular foundation for future expansion into richer interactions and progression systems

## Highlights

- Gamified learning flow with clear course discovery
- Modular course and topic layout
- Support for quizzes and assessments per topic
- Clean separation between content, templates, and application UI

## Project structure

- `docs/` - Static course content and educational assets
- `src/` - Angular application source
  - `app/home/` - Landing page experience
  - `app/course/` - Course overview and topic navigation
  - `app/app.routes.ts` - Routing configuration
- `templates/` - Reusable content templates for course and topic pages
- `tests/` - End-to-end test coverage

## Content model

The platform is organized around courses and topics. Each course contains ordered topic folders and optional quiz data, making it easy to add new lessons and assessments.

Typical course layout:

```text
docs/
  courses/
    java/
      index.html
      01-intro/
        index.html
        quiz.json
      02-install/
        index.html
```

## Development

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm start
```

Then open http://localhost:4200.

### Build for production

```bash
npm run build
```

## Testing

```bash
npm test
```

## Goals

This project is designed to evolve into a full gamified education platform with:

- progress tracking
- achievement systems
- interactive challenges
- richer course progression
- personalized learning paths

## License

This project is licensed under the MIT License.
