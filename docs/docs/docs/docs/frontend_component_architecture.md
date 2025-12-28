# Frontend Component Architecture & Design System
(Issue #36)

## Purpose
This document describes the planned React frontend component architecture
for the NourishNet project. The goal is to keep the frontend modular,
readable, and easy to extend as the project grows.

The frontend is built using React with Vite.

---

## 1. Component Hierarchy

High-level component structure based on the current project setup:

App  
└── Layout  
    ├── Navbar  
    ├── Main Content (Routes)  
    │   ├── HomePage  
    │   ├── LoginPage  
    │   ├── SignupPage  
    │   ├── DashboardPage  
    │   ├── AdminPage  
    │   ├── AboutPage  
    │   └── ContactPage  
    └── Footer  

Each page is composed of smaller reusable UI and feature components.

---

## 2. Reusable UI Components

Reusable components planned and partially reflected in the existing UI/UX work:

### Basic UI Components
- Button
- Input
- TextArea
- Select
- Card
- Modal
- Alert / Notification
- Loader / Spinner

### Layout Components
- Container
- Section
- PageWrapper

These components help maintain consistent styling and behavior across pages.

---

## 3. State Management Strategy

The project uses **React Context API** for shared state.

### Planned shared state:
- Authentication status (logged-in user)
- User role (regular user or admin)
- Basic UI state (loading, error messages)

Local component state is handled using `useState`.
Redux is not used to keep the frontend simple and lightweight.

---

## 4. Routing Structure

Routing is handled using **React Router**.

Planned and documented routes:
- `/` – Home
- `/login` – Login
- `/signup` – Signup
- `/dashboard` – User dashboard
- `/admin` – Admin dashboard
- `/about` – About
- `/contact` – Contact

Routes like dashboard and admin are intended to be protected
based on authentication state.

---

## 5. Wireframes and User Flows

Wireframes are created for the main user flows:
- Home page layout
- Login and signup flow
- User dashboard overview
- Admin dashboard overview

Wireframes focus on layout and structure and are stored
in the `docs/assets` directory as images.

---

## 6. Styling and Design System

The frontend styling approach is based on **utility-first CSS**
using Tailwind CSS.

Design principles:
- Consistent spacing and typography
- Reusable UI components instead of page-specific styling
- Clear color contrast for accessibility

Buttons, cards, and form elements follow the same design rules
across all pages.

---

## 7. Responsive Design Plan

Responsive breakpoints:
- Mobile: below 640px
- Tablet: 640px – 1024px
- Desktop: above 1024px

Approach:
- Mobile-first design
- Flexible layouts using Flexbox and Grid
- Navigation adapts to smaller screen sizes

---

## Summary

This document defines the planned frontend structure for NourishNet,
including component hierarchy, reusable components, state management,
routing, styling, and responsive design guidelines.

It serves as a reference for current and future frontend development.
