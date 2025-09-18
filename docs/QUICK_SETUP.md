# NourishNet Quick Setup Guide 🚀

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js 18+** installed
- **Docker & Docker Compose** installed
- **Git** configured with your GitHub account
- **VS Code** (recommended IDE)
- **PostgreSQL client** (for database management)

## 🚀 Quick Start (5 minutes)

### 1. Clone and Setup Repository
```bash
# Clone the repository
git clone git@github.com:Muditha-Kumara/CapstoneProject2.git
cd CapstoneProject2

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

### 2. Start Development Environment
```bash
# Start all services with Docker Compose
docker-compose up --build

# Wait for all services to start (about 2-3 minutes)
# You'll see logs from frontend, backend, and database
```

### 3. Verify Setup
Open these URLs in your browser:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/health
- **Database Admin:** http://localhost:8080 (Adminer)

### 4. Create Your First Branch
```bash
# Create and switch to your feature branch
git checkout -b feature/1-project-setup

# Make your first commit
git add .
git commit -m "feat: initial project setup"
git push origin feature/1-project-setup
```

## 📁 Project Structure Overview

```
CapstoneProject2/
├── src/
│   ├── frontend/          # React application
│   │   ├── src/
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── pages/         # Page components
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── services/      # API service layer
│   │   │   ├── utils/         # Utility functions
│   │   │   └── types/         # TypeScript type definitions
│   │   ├── public/        # Static assets
│   │   └── package.json   # Frontend dependencies
│   │
│   ├── backend/           # Node.js API server
│   │   ├── src/
│   │   │   ├── controllers/   # Request handlers
│   │   │   ├── models/        # Database models
│   │   │   ├── routes/        # API route definitions
│   │   │   ├── middleware/    # Custom middleware
│   │   │   ├── services/      # Business logic layer
│   │   │   └── utils/         # Utility functions
│   │   ├── tests/         # Backend tests
│   │   └── package.json   # Backend dependencies
│   │
│   └── shared/            # Shared utilities and types
│
├── database/
│   ├── migrations/        # Database schema migrations
│   └── seeders/          # Sample data for development
│
├── tests/
│   ├── e2e/              # End-to-end tests
│   └── performance/      # Performance tests
│
├── docs/                 # Project documentation
├── .github/workflows/    # CI/CD configuration
├── docker-compose.yml    # Development environment setup
└── .env.example         # Environment variables template
```

## 🛠️ Development Commands

### Frontend Development
```bash
cd src/frontend

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Backend Development
```bash
cd src/backend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run database migrations
npm run db:migrate

# Seed development data
npm run db:seed

# Run linting
npm run lint
```

### Database Management
```bash
# Connect to development database
docker-compose exec db psql -U postgres -d nourishnet

# Run migrations
cd src/backend && npm run db:migrate

# Rollback migrations
cd src/backend && npm run db:migrate:down

# Reset database (caution!)
cd src/backend && npm run db:reset
```

## 🎯 Team Workflow

### Daily Workflow
1. **Morning Standup (9:00 AM)** - 15 minutes
2. **Pull latest changes** from main branch
3. **Work on assigned issues** - 2-5 hours focused development
4. **Code review** - 30 minutes daily
5. **Push progress** and update GitHub issues

### Weekly Planning
- **Monday:** Sprint planning (9:00 PM - 10:00 PM)
- **Friday:** Retrospective (9:00 PM - 10:00 PM)

### Branch Naming
```bash
feature/issue-number-description    # New features
fix/issue-number-description       # Bug fixes
hotfix/description                 # Critical fixes
docs/description                   # Documentation updates
```

### Commit Messages
```bash
feat(scope): description           # New feature
fix(scope): description           # Bug fix
docs(scope): description          # Documentation
test(scope): description          # Tests
refactor(scope): description      # Code refactoring
```

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill processes using ports 3000, 5000, 5432
sudo lsof -t -i:3000 | xargs kill -9
sudo lsof -t -i:5000 | xargs kill -9
sudo lsof -t -i:5432 | xargs kill -9

# Restart Docker Compose
docker-compose down
docker-compose up --build
```

**Database Connection Issues**
```bash
# Reset Docker volumes
docker-compose down -v
docker-compose up --build

# Check database logs
docker-compose logs db
```

**Node Modules Issues**
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Permission Issues (Linux/Mac)**
```bash
# Fix Docker permission issues
sudo chown -R $USER:$USER .
sudo chmod -R 755 .
```

### Getting Help

1. **Check GitHub Issues** - Look for existing solutions
2. **Daily Standup** - Ask team members for help
3. **Code Review** - Get feedback on your approach
4. **Documentation** - Review API docs and guides

## 📚 Learning Resources

### Required Reading
- [Project Proposal](./PROJECT_PROPOSAL.md) - Understand the project goals
- [Development Guide](./DEVELOPMENT_GUIDE.md) - Coding standards
- [Project Management Plan](./PROJECT_MANAGEMENT_PLAN.md) - Project Management Plan
- [Implimentation Action Plan](./IMPLEMENTATION_ACTION_PLAN.md) - Implimentation Action Plan
- [GitHub Issues Template](./GITHUB_ISSUES_TEMPLATE.md) - All project tasks
- [Quick Setup](./QUICK_SETUP.md) - Quick Steup Guide

### Technology Documentation
- **React:** https://react.dev/learn
- **Node.js & Express:** https://expressjs.com/en/starter/installing.html
- **PostgreSQL:** https://www.postgresql.org/docs/
- **Docker:** https://docs.docker.com/get-started/
- **TypeScript:** https://www.typescriptlang.org/docs/

### Best Practices
- **Git Workflow:** https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow
- **Testing:** https://testing-library.com/docs/
- **Security:** https://owasp.org/www-project-top-ten/
- **Performance:** https://web.dev/performance/

## 🎯 Success Metrics

By November 1st, the project should demonstrate:

### Technical Metrics
- **Code Quality:** 90%+ test coverage, clean linting
- **Performance:** <3s page load, <500ms API response
- **Security:** No critical vulnerabilities, proper authentication
- **Documentation:** Complete API docs, setup guides, code comments

### Professional Metrics
- **Project Management:** All GitHub issues completed on time
- **Team Collaboration:** Daily standups, code reviews, documentation
- **Best Practices:** Clean Git history, professional code structure
- **Deployment:** Live demo application accessible online

### Portfolio Value
- **Full-Stack Skills:** React + Node.js + PostgreSQL + Docker
- **DevOps Experience:** CI/CD pipelines, cloud deployment
- **Team Leadership:** Project management, code review, mentoring
- **Problem Solving:** Technical challenges documented and solved

## 🚀 Ready to Start?

1. **Complete the setup steps above**
2. **Review the project documentation**
3. **Join your first daily standup**
4. **Pick your first GitHub issue**
5. **Start building something amazing!**

Remember: This project is not just about building software—it's about demonstrating professional development skills that employers value. Focus on quality, documentation, and teamwork throughout the process.

Good luck building NourishNet! 🍽️✨
