![NourishNet Banner](./docs/assets/happy_child.png)

# NourishNet 🍽️🌱

Mobilizing communities to directly address childhood food insecurity by connecting children in need with a network of donors and food providers.

[📄 Project Proposal](./docs/PROJECT_PROPOSAL.md) | [🛠️ Development Guide](./docs/DEVELOPMENT_GUIDE.md) | [📋 Project Board](https://github.com/users/Muditha-Kumara/projects/6)

---

## 🚀 Features
- Transparent, open-source platform
- Connects children in need with donors and food providers
- Community-driven support and engagement
- Real-time updates and progress tracking
- Secure and privacy-focused

## 🛠️ Tech Stack
- **Frontend:** React (Vite, Bootstrap)
- **Backend:** Node.js (Express)
- **Database:** PostgreSQL
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions

## 📁 Project Structure
```text
CapstoneProject2/
├── src/
│   ├── frontend/      # React app
│   ├── backend/       # Node.js API
│   └── shared/        # Shared utilities
├── tests/             # Unit and integration tests
├── database/          # Migrations and seeders
├── github/workflows/  # CI/CD workflows
├── docs/              # Documentation
├── docker-compose.yml # Multi-container orchestration
├── .env.example       # Example environment variables
└── ...
```

## ⚡ Quick Start
1. **Clone the repository:**
   ```bash
   git clone git@github.com:Muditha-Kumara/CapstoneProject2.git
   cd CapstoneProject2
   ```
2. **Install dependencies:**
   ```bash
   cd src/frontend && npm install
   cd ../backend && npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in both `src/frontend` and `src/backend` and fill in required values.
4. **Run PostgreSQL database:**
   - Use Docker Compose:
     ```bash
     docker-compose up --build
     ```
5. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 🧪 Testing
- Frontend: `npm test` in `src/frontend`
- Backend: `npm test` in `src/backend`

## 🤝 Contributing
1. Fork the repo and create your branch: `git checkout -b feature/your_feature`
2. Commit your changes: `git commit -m "feat: add new feature"`
3. Push to the branch: `git push origin feature/your_feature`
4. Open a Pull Request

See `DEVELOPMENT_GUIDE.md` for coding standards and workflow.

## 📄 License
This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

## 📬 Contact
- Issues & Feedback: [GitHub Issues](https://github.com/Muditha-Kumara/CapstoneProject2/issues)

---

> _"Together, we can nourish every child."_
