# ChopDey

A Lagos food ordering app built with React, TypeScript, Vite, and Firebase.

## AI-Assisted Development

Artificial Intelligence was used throughout the development of ChopDey as a software engineering assistant. AI helped scaffold the project structure, generate React and TypeScript components, create Firebase integration, implement the MVVM architecture, produce reusable UI components, and generate Firestore services and security rules.

Development followed a structured prompt-driven workflow using PROMPTS.md, where each prompt focused on a specific feature or milestone. After each prompt, the generated code was reviewed, tested, and integrated into the project before moving to the next phase.

AI also assisted in producing documentation, improving code consistency, and accelerating repetitive implementation tasks while allowing the developer to focus on architecture, validation, testing, and refinement.

## Manual Improvements and Refactoring

During development, several AI-generated implementations were reviewed and improved manually to ensure correctness, maintainability, and alignment with project requirements.

Examples include:

- Replaced duplicated Zone and Venue interfaces with the shared TypeScript models from the project's central types module.
- Fixed missing Firestore imports (`getDoc`, `getDocs`, `query`, `where`) that prevented compilation.
- Added validation for missing Firestore documents before accessing document data.
- Improved error handling by replacing raw Firebase errors with user-friendly messages.
- Removed unused helper functions and redundant code.
- Verified that generated services followed the required MVVM architecture and respected the separation between services, models, view models, and views.
- Updated project prompts and maintained a correction log to improve consistency for future AI-generated code.
- Reviewed generated code for readability, consistency, and adherence to the project's architecture before committing changes.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Firebase (Firestore, Authentication)
- **Architecture:** MVVM (Model-View-ViewModel)
- **Linting:** Oxlint

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run linter |
| `npm run seed` | Seed Firestore with venue data |
