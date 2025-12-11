Frontend Development Guidelines – NourishNet
🧱 1. File Naming Conventions

Use lowercase names for all files

Use hyphens for multi-word names

Example: food-request-form.html

Avoid spaces in filenames

📁 2. Folder Structure Rules

/components → Reusable UI blocks (cards, buttons, modals)

/pages → Full pages (home, login, dashboard)

/assets → Images, icons, fonts

/styles → CSS or Tailwind config

/context → State management

🎨 3. Coding Style Guidelines

Use consistent indentation (2 or 4 spaces)

Keep lines under 120 characters

Avoid inline styles unless needed

Always separate structure (HTML), style (CSS), and behavior (JS)

💬 4. Commenting Rules

Add comments above major sections
Example:

<!-- Navigation Bar Section -->


Add comments when code performs a non-obvious action
Example:

<!-- Fetching user data from API -->

🎛 5. UI Consistency Rules

Use the same button style everywhere

Keep spacing consistent (margin + padding)

Use unified colors and typography

Prefer reusable components instead of repeating HTML blocks

🧪 6. Naming Conventions (CSS + JS)

CSS classes: dashboard-header, btn-primary, card-container

JS variables: userEmail, requestData, formErrors

React components: LoginForm, DashboardSidebar, RequestCard

📱 7. Responsive Design Guidelines

Follow a mobile-first approach.

Breakpoints:

sm: ≥ 640px

md: ≥ 768px

lg: ≥ 1024px

xl: ≥ 1280px

Use utility classes like:

md:flex-row
lg:w-1/2
xl:text-lg
