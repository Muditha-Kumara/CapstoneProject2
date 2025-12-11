Project Structure Explanation – NourishNet

This document explains the file and folder structure of the NourishNet system.
It helps new contributors understand where different parts of the code belong and how the project is organized.

🗂️ Root Directory
/
├── docs/
├── components/
├── pages/
├── api/
├── utils/
├── assets/
├── styles/
├── .env.example
├── README.md
└── docker-compose.yml

📁 1. /docs

This folder contains all documentation files used by developers and contributors.

Examples:

frontend_architecture_plan.md

frontend_guidelines.md

project_structure_explained.md

user_manual.md (upcoming)

troubleshooting.md (upcoming)

🧩 2. /components

Contains reusable UI components shared across pages.

Examples:

Button.js

Navbar.js

Footer.js

RequestCard.js

StatisticCard.js

These help maintain visual consistency and reduce duplicated code.

🧭 3. /pages

Each file in this folder represents one full page of the web application.

Examples:

HomePage.js

LoginPage.js

SignupPage.js

DashboardPage.js

RequestHistoryPage.js

Pages combine components to create full screens.

🔧 4. /utils

Utility functions and helpers.

Examples:

Validation helpers

Date or time formatting

API error handling

🎨 5. /styles

Contains global CSS styles, Tailwind configuration, or theme settings.

Examples:

global.css

theme.css

Tailwind config (if used)

🖼️ 6. /assets

Stores images, icons, and fonts used in the UI.

Examples:

logo.png

icons/…

banner.jpg

illustrations/…

🔌 7. /api

Frontend API integration files that talk to the backend.

Examples:

authAPI.js

requestAPI.js

dashboardAPI.js

These files organize all HTTP requests in one place.

⚙️ 8. Configuration Files
.env.example

Shared environment variable template without sensitive data.

docker-compose.yml

Defines the services (frontend/backend/database) used in development.