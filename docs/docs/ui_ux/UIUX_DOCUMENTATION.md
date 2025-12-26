📘 NourishNet — UI/UX Design Documentation

Author: Tahbir Moon
Team: Frontend
Date: 2025

1. Overview

This document presents the complete UI/UX design system for the NourishNet platform, including brand identity, layout specifications, interactive components, modal flows, dashboards, and error pages.

The purpose of this documentation is to guide frontend development and ensure visual consistency across all application modules.

All screenshots and visual assets used in this document are stored in:

docs/ui_ux/images/

2. Brand Identity
2.1 Color Palette & Visual Language

The NourishNet brand focuses on trust, care, and community.
Colors were chosen to reflect:

Green (#13795B) – safety, trust, food security

Accent Yellow (#F59E0B) – highlights, donations

Soft Surface (#FFF9F0) – warmth and approachability

Deep Text (#111827) – readability and accessibility

3. Typography & Layout System

Headings, body text, and spacing follow a scalable system to ensure clean hierarchy.

Key principles:

Large titles to emphasize mission & actions

Medium-weight section headers

Comfortable spacing: 24–48px gaps

Rounded elements: 16px radius for friendlier interaction

Typography guidelines are visible in the design system screenshot included above.

4. Component Library

The component library defines reusable UI blocks:

Buttons

Primary (green)

Secondary (outline)

Accent (yellow)

States: normal, hover, disabled

Form Inputs

Text fields

Email fields

Dropdown

Error / focus states

Interactive Elements

Checkboxes

Radio buttons

Icons

Modal Specifications

Max width 400–600px

Padding: 24px

Backdrop blur

Fade + scale animation

Accessibility

WCAG 2.1 AA compliant

Focus outlines

Screen reader labels

Minimum touch targets

5. Page Designs
5.1 Home Page

The landing page focuses on:

Clear mission statement

Two main CTAs: Request Food & Donate

Real-time statistics

“How it Works” steps

The design aims for emotional connection + trust-building.

5.2 Request Status Tracking & Dashboard

Includes:

Five-step meal request progress timeline

Provider matching

Meal preparation updates

User dashboard summary

Recent activity panel

6. Modal Designs

Modals are essential interaction components. Each modal includes validation, responsive layout, and accessibility features.

6.1 Request Food Modal

Features:

Child count selector

Age groups (Toddlers, Elementary, Middle School…)

Meal type selection

Schedule picker

Dietary requirements & allergies

Safety notes

6.2 Volunteer Application Modal

Contains:

Full form layout

Validation states (success, error, loading)

Onboarding steps (Application → Background Check → Training → Start)

6.3 Provider Application Modal

Fields include:

Organization type

Contact person

Email

Partnership interest

6.4 Donation Modal

Includes:

Donation amounts

One-time vs recurring option

Payment states

Donation success summary

7. Error Pages & Edge Cases

Includes:

404 – Page Not Found

500 – Server Error

No Providers Available state

These screens improve user trust by providing clear explanations and next-step guidance.

8. UX Principles Applied

The UI/UX design ensures:

✔ Accessibility

Color contrast, clear labels, focus outlines, readable typography.

✔ Simplicity

Straightforward user flows with minimal friction.

✔ Trust & Safety

Emphasis on child protection and anonymity.

✔ Scalability

A unified design system for all upcoming pages and components.

✔ Mobile-first

Modals, forms, and pages are fully responsive.

9. Conclusion

The UI/UX designs documented here form the foundation of the NourishNet frontend.
This system ensures consistency, accessibility, and clarity across all interfaces.

This documentation will support:

Component development

Frontend architecture

Testing and QA

Future feature iterations

