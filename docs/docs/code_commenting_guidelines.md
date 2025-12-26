Code Commenting & Inline Documentation Guidelines

This document describes how comments should be written throughout the codebase to keep the project readable and consistent.

1. General Principles

Comments should explain why, not just what.

Keep comments short, clear, and relevant.

Update comments when the code changes.

Avoid commenting every line — comment only when helpful.

2. When to Add Comments
✔ Before major sections
<!-- Dashboard Header Section -->

✔ When logic is not immediately obvious
// Convert timestamp to readable date

✔ When using temporary or experimental code
// TODO: Replace with optimized API call

✔ For complex functions
/**
 * Calculates total donations for the current user.
 * Params: userId
 * Returns: number
 */

3. Avoid These Types of Comments

Comments that repeat the code:

x = x + 1; // add 1 to x ❌


Outdated or misleading comments

Too many comments (noise)

4. Comment Style by Language
HTML
<!-- Main Navigation Bar -->

CSS
/* Reusable button style */

JavaScript
// Check if user is authenticated

React (if used later)
// Render user info card

5. Documentation Tags (Optional)

Use tags for standard documentation:

TODO: Something to finish later

FIXME: Something broken or temporary

NOTE: Important detail

INFO: Background explanation

Examples:

// TODO: Replace hardcoded user ID with dynamic value

6. Summary

Comments must be meaningful

Explain purpose, not syntax

Keep them updated

Follow consistent styles across the project