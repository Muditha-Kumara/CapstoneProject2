NourishNet Frontend Component Architecture Plan

Prepared by: Tahbir Moon
Issue: #36 – Frontend Component Architecture Planning

1. Component Hierarchy Diagram

App
 ├── Navbar
 ├── Footer
 ├── Router
 │     ├── HomePage
 │     ├── AboutPage
 │     ├── HowItWorksPage
 │     ├── ContactPage
 │     ├── LoginPage
 │     ├── SignupPage
 │     └── Dashboard
 │           ├── Sidebar
 │           ├── StatisticCards
 │           ├── RecentRequests
 │           └── RequestFormModal
 └── UI Components
        ├── Button
        ├── InputField
        ├── Card
        ├── Modal
        └── NotificationBadge



2. Reusable UI Components
Buttons

⭐ PrimaryButton
⭐ SecondaryButton
⭐ DangerButton
⭐ OutlineButton

Cards

🟩 StatisticCard
🟩 RequestCard
🟩 InfoCard

Inputs

📝 TextInput
📝 EmailInput
📝 PasswordInput
📝 Dropdown
📝 TextArea

Modals

🔒 LoginModal
🔑 SignupModal
📨 FoodRequestModal

Misc

⚙️ Spinner
➖ Divider
🏷️ Badge
❗ AlertMessage

3. State Management (Context API)
Folder Structure
/context
    AuthContext.js
    NotificationContext.js
    RequestContext.js

Global State Items

📌 auth
📌 user data
📌 notifications
📌 food requests

4. Routing Structure
Routes
Route	Page
/	HomePage
/about	AboutPage
/how-it-works	HowItWorksPage
/contact	ContactPage
/login	LoginPage
/signup	SignupPage
/dashboard	DashboardPage
/dashboard/requests	RequestHistoryPage
Flow
Home → Login → Dashboard → Food Request Modal
                     ↓
                Notifications Page

5. Wireframes

Wireframes should be stored in:

docs/wireframes/


Example filenames:
🖼️ home.png
🖼️ dashboard.png
🖼️ login.png
🖼️ signup.png

6. Styling Approach
TailwindCSS

🎨 utility-first styling

📏 consistent spacing

📱 responsive classes

⚡ fast UI development

Example:

<div class="flex flex-col p-4 bg-white rounded-lg shadow">

7. Responsive Breakpoints
Breakpoint	Width
📱 sm	≥ 640px
📱 md	≥ 768px
💻 lg	≥ 1024px
🖥️ xl	≥ 1280px
