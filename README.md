# BusyCaliSPA

BusyCaliSPA is a mobile-first single page fitness app built for busy users who want structured calisthenics workouts, quick onboarding, and simple progress tracking. The project runs as a fully client-side SPA using vanilla HTML, CSS, and JavaScript, with hash-based navigation and browser localStorage used for persistence.

## Overview

The app is designed around a single `index.html` shell that loads `app.js` and `styles.css`, then renders each page view dynamically into the `#app` container. The JavaScript defines the full application flow for authentication, onboarding, routines, workout execution, progress review, and profile management, while the CSS gives the product a branded mobile app appearance.

BusyCali presents itself with the tagline “Calisthenics, for Busy People.” Its About page explains that the app is intended for users who want accessible bodyweight training they can do anywhere, with routines matched to experience level and goals.

## Core features

### Authentication and account flow

- Users can create an account with name, username, email, and password, then log in through dedicated auth screens.
- Account data is stored in localStorage under `usersList`, while the current signed-in session is stored in `current_user` so the app can restore a logged-in user on page load.
- Protected routes prevent non-logged-in users from opening dashboard, routines, profile, progress, workout, and end-workout pages directly.

### Onboarding and personalization

- After sign-up, users complete a four-step onboarding flow covering fitness level, measurements, goal, and equipment.
- Onboarding responses are saved in localStorage under `profileList`, keyed by username, and later reused in the dashboard and profile views.
- The dashboard recommends routines based on the user’s stored fitness level, helping the app feel tailored rather than static.

### Routines and workout tracking

- The app includes built-in calisthenics routines for beginner, intermediate, and advanced users.
- Each routine contains a name, duration, fitness level, and an exercise list with predefined sets and reps.
- Users can filter routines by level, preview a routine before starting, and then complete workouts one set at a time while entering completed reps.
- At the end of a session, the app generates a workout summary showing completed sets, total reps, and a breakdown by exercise.

### Progress and profile views

- Completed sessions are saved per user in localStorage under `workoutList`, including the date, routine name, and full completed set log.
- The progress page shows monthly totals, total workout count, and previous sessions with per-set exercise breakdowns.
- The profile page displays stored user details such as level, goal, age, height, weight, and workout count, and includes an edit form for profile metrics.

## Built-in routines

| Routine | Level | Duration | Exercises |
|---|---|---|---|
| Push Routine | Beginner | 20 min | Push-ups, Dips, Pike Push-ups |
| Pull Routine | Beginner | 30 min | Assisted Pull-ups, Chin-ups, Inverted rows |
| Push Routine | Intermediate | 20 min | Archer Push-ups, Pseudo Planche Push-ups, Decline Push-ups |
| Advanced Skills | Advanced | 20 min | Muscle-ups, Handstand Push-ups, L-sit Pull-ups |


### Component styling

- Primary call-to-action buttons use full-width rounded blocks with the primary turquoise color and hover transitions to a darker blue.
- Routine cards, progress cards, profile cells, and summary chips all use rounded card styling and compact spacing designed for quick scanning on mobile.
- Workout views use large centered exercise cards, numeric rep inputs, and stacked action buttons to support set-by-set interaction.

## Tech stack

| Layer | Implementation |
|---|---|
| Markup | `index.html` provides a minimal shell with `#nav` and `#app` containers, then loads `app.js`. |
| Logic | `app.js` handles SPA routing, rendering, state, localStorage, auth, onboarding, routines, workout progression, and session logging. |
| Styling | `styles.css` defines typography, color variables, gradients, cards, forms, navigation, and mobile layout rules. |
| Assets | Images such as the BusyCali banner and logo are loaded from `resources/images`. |

## Project structure

```text
BusyCaliSPA/
├── index.html
├── app.js
├── styles.css
├── README.md
└── resources/
    └── images/
```

This matches the public repository structure visible on GitHub.

## Running locally

1. Clone or download the repository.
2. Open `index.html` in a browser.
3. Keep `app.js`, `styles.css`, and `resources/images` in their existing relative locations so the SPA and branding assets load correctly.

Because the visible project structure contains only front-end files and no package manifest or backend service, the app appears intended to run as a static local project using browser storage for data persistence.

## Notes

- BusyCaliSPA is a good example of a coursework or portfolio-style vanilla JavaScript SPA that demonstrates routing, conditional rendering, and browser-based persistence without frameworks.
- Since passwords and user records are stored in localStorage, the authentication system is suitable for learning and prototyping rather than production use.
- The styling reinforces the product concept effectively by combining bold typography, energetic blue gradients, and compact mobile app layouts around a fitness-focused training flow.
