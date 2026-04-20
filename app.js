// ==========================
// 1. Global State
// ==========================

const state = {
  loggedIn: localStorage.getItem('busycali_loggedin') === 'true',
  currentScreen: 'intro',
  goal: localStorage.getItem('busycali_goal') || null,
  time: localStorage.getItem('busycali_time') || null
};


// ==========================
// 2. Routes
// ==========================

const routes = {
  intro:      IntroPage,
  signin:     SignInPage,
  signup:     SignUpPage,
  onboarding: OnboardingPage,
  home:       HomePage,
  workouts:   WorkoutsPage,
  progress:   ProgressPage,
  about:      AboutPage,
  profile:    ProfilePage
};


// ==========================
// 3. Router & Render
// ==========================

function navigate(screen) {
  state.currentScreen = screen;
  render();
}

function render() {
  const app = document.getElementById('app');
  const nav = document.getElementById('nav');

  nav.innerHTML = state.loggedIn ? Nav() : '';

  const page = routes[state.currentScreen] || IntroPage;
  app.innerHTML = page();

  document.querySelectorAll('#nav button').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.screen === state.currentScreen)
  );

  attachListeners();
}


// ==========================
// 4. Nav Component
// ==========================

function Nav() {
  const tabs = [
    { screen: 'home',     label: 'Home', icon:'' },
    { screen: 'workouts', label: 'Routines', icon:'' },
    { screen: 'progress', label: 'Progress',  icon:'' },
    { screen: 'profile',    label: 'Profile', icon:''}
  ];
  return `
    <nav aria-label="Main navigation">
      ${tabs.map(t => `
        <button data-screen="${t.screen}" onclick="navigate('${t.screen}')">
          <span class="tab-icon">${t.icon}</span>
          <span>${t.label}</span>
        </button>
      `).join('')}
    </nav>
  `;
}


// ==========================
// 5. Reusable Field Component
// ==========================

function Field(id, label, type, placeholder) {
  return `
    <div class="form-group">
      <label for="${id}">${label}</label>
      <input type="${type}" id="${id}" placeholder="${placeholder}" required />
    </div>
  `;
}


// ==========================
// 6. Page Components
// ==========================

function IntroPage() {
  return `
    <section class="intro-screen" aria-label="Welcome">
      <div class="intro-content">
        <img src="resources/images/logo.png" alt="BusyCali logo" class="intro-logo" />
        <p class="tagline">Calisthenics. Built for busy people.</p>
      </div>
      <div class="intro-buttons">
        <button class="btn-primary" id="btn-create">Create Account</button>
        <button class="btn-secondary" id="btn-login">Log In</button>
      </div>
    </section>
  `;
}

function SignInPage() {
  return `
    <section aria-label="Sign in">
      <button class="back-btn" id="btn-back">&#8592; Back</button>
      <h1>Welcome Back</h1>
      <form id="signin-form" novalidate>
        ${Field('signin-email', 'Username', 'text', 'mayra@example.com')}
        ${Field('signin-password', 'Password', 'password', '••••••••••')}
        <p id="form-error" class="error-msg"></p>
        <button type="submit" class="btn-primary">Log In</button>
      </form>
      <p class="switch-link">No account? <span id="go-signup">Sign Up</span></p>
    </section>
  `;
}

function SignUpPage() {
  return `
    <section aria-label="Sign up">
      <button class="back-btn" id="btn-back">&#8592; Back</button>
      <h1>Create Account</h1>
      <form id="signup-form" novalidate>
        ${Field('signup-username', 'Username', 'text', 'e.g. christian99')}
        ${Field('signup-email', 'Email', 'email', 'mayra@example.com')}
        ${Field('signup-password', 'Password', 'password', '••••••••••')}
        <p id="form-error" class="error-msg"></p>
        <button type="submit" class="btn-primary">Sign Up</button>
      </form>
      <p class="switch-link">Have an account? <span id="go-signin">Log In</span></p>
    </section>
  `;
}

function OnboardingPage() {
  return `
    <section aria-label="Quick setup">
      <h1>Quick Setup</h1>
      <p class="onboarding-sub">Takes 10 seconds</p>
      <p class="onboarding-label">Select a Goal</p>
      <div class="pill-group" id="goal-pills">
        ${['Strength', 'Learn Calisthenics', 'Consistency'].map(g => `
          <button class="pill" data-value="${g.toLowerCase()}">${g}</button>
        `).join('')}
      </div>
      <p class="onboarding-label">Time per session?</p>
      <div class="pill-group" id="time-pills">
        ${['20', '30', '45'].map(t => `
          <button class="pill" data-value="${t}">${t} min</button>
        `).join('')}
      </div>
      <button class="btn-primary" id="btn-go" disabled>Go!</button>
    </section>
  `;
}

function HomePage() {
  const user = JSON.parse(localStorage.getItem('busycali_user'));
  const name = user?.username || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return `
    <section aria-label="Home">
      <h1>${greeting}, ${name}</h1>
      <p class="greeting-sub">Ready for a workout?</p>
    </section>
  `;
}

function WorkoutsPage() {
  return `<section aria-label="Workouts"><h1>Routines</h1><p>Coming soon.</p></section>`;
}

function ProgressPage() {
  return `<section aria-label="Progress"><h1>Progress</h1><p>Coming soon.</p></section>`;
}
function ProfilePage() {
  return `<section aria-label="Progress"><h1>Profile</h1><p>Coming soon.</p></section>`;
}

function AboutPage() {
  return `<section aria-label="About"><h1>About BusyCali</h1><p>Coming soon.</p></section>`;
}


// ==========================
// 7. Event Listeners
// ==========================

function attachListeners() {
  const get = id => document.getElementById(id);

  get('btn-create')  ?.addEventListener('click',  () => navigate('signup'));
  get('btn-login')   ?.addEventListener('click',  () => navigate('signin'));
  get('btn-back')    ?.addEventListener('click',  () => navigate('intro'));
  get('go-signup')   ?.addEventListener('click',  () => navigate('signup'));
  get('go-signin')   ?.addEventListener('click',  () => navigate('signin'));
  get('signin-form') ?.addEventListener('submit', handleSignIn);
  get('signup-form') ?.addEventListener('submit', handleSignUp);
  get('btn-go')      ?.addEventListener('click',  handleOnboarding);

  ['goal-pills', 'time-pills'].forEach(groupId => {
    document.querySelectorAll(`#${groupId} .pill`).forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll(`#${groupId} .pill`).forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        checkOnboardingReady();
      });
    });
  });
}


// ==========================
// 8. Auth & Onboarding
// ==========================

function handleSignUp(e) {
  e.preventDefault();
  const username = document.getElementById('signup-username').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  if (!username || !email || !password) {
    return document.getElementById('form-error').textContent = 'Please fill in all fields.';
  }

  // localStorage: saving new user account on sign up
  localStorage.setItem('busycali_user', JSON.stringify({ username, email, password }));
  localStorage.setItem('busycali_loggedin', 'true');
  state.loggedIn = true;
  navigate('onboarding');
}

function handleSignIn(e) {
  e.preventDefault();
  const input    = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;

  // localStorage: retrieving stored user to validate login
  const stored = JSON.parse(localStorage.getItem('busycali_user'));

  if (stored && (stored.email === input || stored.username === input) && stored.password === password) {
    localStorage.setItem('busycali_loggedin', 'true');
    state.loggedIn = true;
    navigate('home');
  } else {
    document.getElementById('form-error').textContent = 'Incorrect username or password.';
  }
}

function checkOnboardingReady() {
  const goal = document.querySelector('#goal-pills .pill.selected');
  const time = document.querySelector('#time-pills .pill.selected');
  document.getElementById('btn-go').disabled = !(goal && time);
}

function handleOnboarding() {
  const goal = document.querySelector('#goal-pills .pill.selected')?.dataset.value;
  const time = document.querySelector('#time-pills .pill.selected')?.dataset.value;

  // localStorage: saving goal and session time permanently for workout recommendations
  localStorage.setItem('busycali_goal', goal);
  localStorage.setItem('busycali_time', time);
  state.goal = goal;
  state.time = time;

  navigate('home');
}


// ==========================
// 9. Init
// ==========================

window.onload = () => {
  if (state.loggedIn && state.goal) {
    navigate('home');
  } else if (state.loggedIn) {
    navigate('onboarding');
  } else {
    navigate('intro');
  }
};