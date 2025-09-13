![NourishNet Banner](./assets/showing_reality.png)

# NourishNet Development Guide 🍽️🚀

[📄 Project Proposal](./ProjectProposal.md) | [🛠️ Development Guide](./DEVELOPMENT_GUIDE.md)

---

Welcome to the NourishNet project! This guide provides essential instructions and professional rules for all developers. For project goals, requirements, and detailed context, see the [Project Proposal](./ProjectProposal.md). For coding standards, workflow, and setup, refer to this Development Guide.

## 📁 Project File Structure

A recommended file structure for the NourishNet project (React frontend, Node.js backend, PostgreSQL database):

```text
CapstoneProject2/
├── README.md
├── DEVELOPMENT_GUIDE.md
├── ProjectProposal.md
├── .gitignore                # Git ignored files (node_modules, .env, etc.)
├── .env.example              # Example environment variables
├── src/
│   ├── frontend/             # React app source code
│   │   ├── package.json      # React dependencies and scripts
│   │   ├── Dockerfile        # Docker config for React app
│   │   ├── public/
│   │   └── src/
│   │   ├── .env.example      # Example env for React
│   │   ├── .env              # Actual env for React (not committed)
│   ├── backend/              # Node.js API source code
│   │   ├── package.json      # Node.js dependencies and scripts
│   │   ├── Dockerfile        # Docker config for Node.js API
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   │   ├── .env.example      # Example env for Node.js
│   │   ├── .env              # Actual env for Node.js (not committed)
│   └── shared/               # Shared utilities or types
├── tests/                    # Unit and integration tests
├── database/
│   ├── migrations/           # PostgreSQL migration scripts
│   └── seeders/              # Sample data for PostgreSQL
├── docker-compose.yml        # Multi-container orchestration
├── github/
│   └── workflows/            # GitHub Actions workflow files (e.g., ci.yml)
└── docs/                     # Additional documentation
```

- Adjust folder names as needed for your chosen tech stack.
- Keep code organized by feature or module for scalability.

---

## 🛠️ 1. Project Setup

1. **Clone the repository:**

   ```bash
   git clone git@github.com:Muditha-Kumara/CapstoneProject2.git
   cd CapstoneProject2
   ```

2. **Install dependencies:**
   - For frontend (React):
     ```bash
     cd src/frontend
     npm install
     ```
   - For backend (Node.js):
     ```bash
     cd src/backend
     npm install
     ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in both `src/frontend` and `src/backend` and fill in required values (including PostgreSQL connection details for backend).

4. **Set up PostgreSQL database:**
   - Install PostgreSQL and create a database for the project.
   - Run migration scripts in `database/migrations/` to set up tables.
   - (Optional) Run seeders in `database/seeders/` to add sample data.

---

## 🎨 2. Coding Standards

- Use clear, descriptive variable and function names.  
  _Example:_ `getUserProfile`, `calculateTotalAmount`, `userList`
- Follow code style guides using Prettier and ESLint for JavaScript/TypeScript.  
  _Example:_ Run `npx prettier --write .` and `npx eslint .` before committing.
- Write comments for complex logic.  
  _Example:_
  ```js
  // Get user profile from backend API
  async function getUserProfile(userId) {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return await response.json();
  }
  ```
- Organize code into logical modules/components.  
  _Example:_ Place React components in `src/frontend/src/components/`, API routes in `src/backend/routes/`, etc.
- Run Prettier and ESLint before committing code to ensure consistency and catch errors.

---

## 🗂️ Professional File Naming Structure

A professional file naming structure is clear, consistent, and descriptive, making it easy for anyone to understand the purpose of each file at a glance.

**Principles:**
- Use lowercase letters and underscores only: `user_profile.js`, `database_config.py`, `order_history.ts`
- Be descriptive and specific: Name files after their main purpose or feature, not generic names like `script.js` or `file1.py`.
- Avoid spaces and special characters: Use `user_profile.js`, not `User Profile.js` or `user-profile.js`.
- Group related files by feature or module:

```text
src/
  components/
    user_profile.js
    order_history.js
  utils/
    date_formatter.js
    api_client.js
```

- Use standard names for entry points and configs: `index.js`, `app.js`, `main.py`, `Dockerfile`, `.env.example`
- For tests, use the same name as the file being tested, with `.test` or `.spec`: `user_profile.test.js`, `order_history.spec.ts`
- For documentation, use clear names: `README.md`, `DEVELOPMENT_GUIDE.md`, `API_REFERENCE.md`

**Example Structure:**

```text
src/
  controllers/
    user_controller.js
    food_controller.js
  models/
    user_model.js
    food_model.js
  routes/
    user_routes.js
    food_routes.js
  utils/
    date_formatter.js
    logger.js
tests/
  user_controller.test.js
  food_controller.test.js
```

Following these conventions improves maintainability, collaboration, and scalability in professional projects.

---

## 🌳 3. Branching & Commit Rules

- Create a new branch for each feature or bugfix:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Create branches with the related issue number and a short description.  
  _Example:_ `feature/12-user-auth`
- Use descriptive commit messages.  
  _Example:_ `Add user authentication module`
- Use commit message prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, etc.  
  _Example:_ `feat: add login form`
- Use commit messages to auto-close issues.  
  _Example:_ `fix: validate email input (closes #15)`
- Push your branch and open a pull request (PR) for review.
- Push your work regularly and open pull requests for review by other team members.
- All project management, issue tracking, and progress updates must be done via GitHub Projects. Always follow the workflow and instructions set in the GitHub Project board.

---

## 🧪 4. Running, Testing, and Deploying

- **Run the project locally:**
  - Frontend (React): `npm start` in `src/frontend`
  - Backend (Node.js): `npm start` in `src/backend`
- **Run tests:**
  - Frontend (React): `npm test` in `src/frontend`
  - Backend (Node.js): `npm test` in `src/backend`
- **Deployment:**
  - Follow instructions in the README or deployment scripts.

---

## 👀 5. Code Review & Pull Requests

- Every PR must be reviewed by at least one other team member.
- Address all review comments before merging.
- Do not merge if tests or linting fail.

---

## 📋 6. Issue Tracking & Communication

- Use GitHub Issues to report bugs, request features, or ask questions.
- Assign issues to yourself when working on them.
- Communicate progress and blockers in GitHub comments.

---

## 📚 7. Additional Professional Rules

- Document major decisions and changes in the project wiki or README.
- Write unit and integration tests for all major features.
- Ensure all code passes linting and automated tests before merging.
- Respect deadlines and communicate delays early.

---

## 🐳 8. Docker Setup (Frontend, Backend, Database)

To run each part of the project in its own Docker container:

### 1. Frontend (React)
Create a `Dockerfile` in `src/frontend/`:

```dockerfile
# src/frontend/Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. Backend (Node.js)
Create a `Dockerfile` in `src/backend/`:

```dockerfile
# src/backend/Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### 3. Database (PostgreSQL)
Use the official PostgreSQL image in your `docker-compose.yml`:

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./src/frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
  backend:
    build: ./src/backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgres://user:password@db:5432/nourishnet
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: nourishnet
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

### 4. Build and Run All Services

From the project root, run:

```bash
docker-compose up --build
```

This will start all three services in separate containers. Adjust ports, environment variables, and volumes as needed for your project.

---

## ⚙️ 9. GitHub Actions (CI/CD)

To automate build and test steps, add a workflow file at `github/workflows/cicd.yml`:

```yaml
name: CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-test-frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: src/frontend
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test

  build-test-backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: src/backend
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
```

This workflow will automatically build and test both frontend and backend on every push or pull request to `main`.

---

**Following these steps and rules will help you contribute effectively and professionally to NourishNet. If you have questions, ask your Project Manager or Lead Developer.**
