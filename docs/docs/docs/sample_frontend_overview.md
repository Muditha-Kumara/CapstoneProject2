Sample Frontend (TypeScript Demo) – Project Overview

This folder contains a stand-alone demo frontend built using React + TypeScript.
It was created only for documentation and learning purposes and does not affect the real NourishNet frontend.

🎯 Purpose of This Demo

Demonstrate how NourishNet could be migrated to TypeScript in the future

Show examples of strongly-typed React components

Provide sample routing structure

Provide a mock API layer using TypeScript interfaces

Help future developers understand TypeScript best practices

📁 Project Structure
sample-frontend-ts/
│── README.md
│── package.json
│── package-lock.json
└── src/
    ├── api/
    │   └── mockApi.ts
    ├── components/
    │   └── Button.tsx
    ├── pages/
    │   ├── Home.tsx
    │   ├── About.tsx
    │   ├── Contact.tsx
    │   └── Dashboard.tsx
    ├── types/
    │   └── index.ts
    ├── Router.tsx
    ├── app.tsx
    └── main.tsx

⚙️ How to Run (Optional)

This demo is not required to run, but developers may test it:

cd docs/sample-frontend-ts
npm install
npm run dev


Runs on:
👉 http://localhost:5173/

🧩 Features Demonstrated
✔ TypeScript Components

Reusable components such as:

Button.tsx

Typed props using interfaces

✔ Routing Example

A working React router with:

Home

About

Contact

Dashboard

✔ Mock API

Located in:

src/api/mockApi.ts


Includes:

Typed API responses

Example fetch simulation

🚀 Future Improvements

This sample can be extended later with:

Form validation using TypeScript

Light/dark theme demo

State management using Context API

Full Storybook component documentation

📘 Summary

This demo helps developers understand:

TypeScript folder structure

Component design patterns

How NourishNet could look if fully typed

It is not part of the real application but is valuable for onboarding and teaching TypeScript concepts.