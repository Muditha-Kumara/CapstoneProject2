Component Library Overview

This document describes the shared UI components used across the frontend.
These components support consistency, reusability, and faster development.

1. Buttons

PrimaryButton

SecondaryButton

OutlineButton

DangerButton

2. Cards

StatisticCard

RequestCard

InfoCard

3. Form Inputs

TextInput

EmailInput

PasswordInput

Dropdown

TextArea

4. Modals

LoginModal

SignupModal

FoodRequestModal

5. Navigation Components

DashboardSidebar

TopNavigationBar (if added later)

6. Data Display

Badge

Divider

AlertMessage

Spinner

7. Usage Guidelines

Use components instead of rewriting UI code.

Follow naming rules from frontend_guidelines.md.

Keep components small and focused.

Add prop checking where needed.

8. Folder Structure
src/
 └── components/
      ├── buttons/
      ├── cards/
      ├── inputs/
      ├── modals/
      ├── layout/
      └── common/

9. Component Updates

Any new shared component should be added to this document so the team is always aligned.