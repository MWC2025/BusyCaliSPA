// ==========================
// 1. Global State
// ==========================

const state = {
  user: null,
  isLoading: false
};

// ==========================
// 2. Navigation Component
// ==========================

function Nav() {
  return `
    <nav>
      <div class="nav-left">
        ${state.user ? `<a href="#/dashboard">Home</a>` : ''}
        ${state.user ? `<a href="#/profile">Profile</a>` : ''}
        ${state.user ? `<a href="#/progress">Progress</a>` : ''}
        ${state.user ? `<a href="#/routines">Routines</a>` : ''}
      </div>
      <div class="nav-right">
        ${state.user 
          ? `<a href="#" id="logoutLink">Logout</a>` 
          : ''}
      </div>
    </nav>
  `;
}
// ==========================
// 3. Route Map
// ==========================

const routes = {
  '#/': Intro,
  '#/login': LogIn,
  '#/dashboard': Home,
  '#/about': About,
  '#/profile': Profile,
  '#/onboarding': Onboarding,
  '#/progress': Progress,
  '#/signup' : SignUp,
  '#/routines' : Routines
};

// Define protected routes list (what's behind the login)
const protectedRoutes = ['#/dashboard', '#/profile', '#/Home','#/progress'];

function router() {
  const hash = window.location.hash || '#/';

  // Route guard:
  // If the current route is one of the protected routes AND there is no logged-in user, 
  // redirect the user to the login page.
  if (protectedRoutes.includes(hash) && !state.user) {
    window.location.hash = '#/login';
    return;
  }

  render();
}

// ==========================
// 4. Render Engine - what is being showed on the document (html)
// ==========================

function render() {
  const app = document.getElementById('app');
  const nav = document.getElementById('nav');

  nav.innerHTML = Nav();  //  display nav every time

  if (state.isLoading) {
    app.innerHTML = `<p>Loading...</p>`;
    return;
  }

// Get the function from the routes object that matches the current URL hash
// (defaulting to '#/' if no hash exists).
// If a matching route function is found, render it.
// Otherwise, display the 404 message.
  const page = routes[window.location.hash || '#/'];
  app.innerHTML = page ? page() : `<h1>404 <br><br> Page does not exist</h1>`;

  attachEvents();
}

// ==========================
// 5. Pages Components
// ==========================
// here if (state.user) checks if the user is logged in or not

function Intro() {
  return `
    <img src="resources/images/logo.png" alt="logo image">
    <p>Calisthenics, for Busy People.</p>
    

    <button id="loginPg">Login</button>
    <button id="CreateAccBtn">Create Account</button>


  `;
}


function LogIn() {
  if (state.user) {
    return `
      <h1>Welcome back, <span style="color: #0593f2;">${state.user}</span></h1>
      <button id="logoutBtn">Logout</button>
    `;
  }

  return `
    <button id="Back">Back</button>  
    <h1>Login</h1>
    
    <input id="username" placeholder="Username"> <br> <br>
    <input id="password" type="password" placeholder="Password"> <br><br>
    <button id="loginBtn">Login</button>
  `;
}

function SignUp() {
  return `
    <button id="Back">Back</button>  
    <h1>Create Account</h1>

    <input id="username" placeholder="Username"> <br> <br>
    <input id="email" placeholder="Email"> <br> <br>
    <input id="password" type="password" placeholder="Password"> <br><br>
    <button id="onbNext">Next</button>
    <p>Already have an account?<a href="#/login">Login</a></p> `;
}

function Home() {
  return `
    <h1><span style="color: #0593f2;">${state.user}'s </span>Dashboard</h1>
    <p>Protected content. User must be logged in to view this page</p>
  `;
}

function About() {
  return `
  <h1>About Page</h1>
  <p> Some information about the app</p>`;
}
function Profile() {
    if (state.user) {
    return `
      <h1> <span style="color: #0593f2;">${state.user}</span>'s Profile</h1>
      <p> This is the profile page when the user is logged in </p>
    `;
  }

  return `
    <h1>Locked</h1>
    <p>Must be Logged in to view Profile</p>
  `;
}

function Progress() {
    if (state.user) {
    return `
      <h1> Progress</h1>
      <p> This is the Progress page when the user is logged in </p>
    `;
  }

  return `
    <h1>Locked</h1>
    <p>Must be Logged in to view Progress</p>
  `;
}

function Onboarding() {
  return `
  <button id="Back">Back</button>  
  <h1>Onboarding Flow </h1>
  <p> Some information about the app</p>`;
}

function Routines() {
  return `
  <button id="Back">Back</button>  
  <h1>Onboarding Flow </h1>
  <p> Some information about the app</p>`;
}

// ==========================
// 6. Event Binding
// ==========================

function attachEvents() {

  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) loginBtn.addEventListener('click', login);
   
const loginPg = document.getElementById('loginPg');
if (loginPg) { loginPg.addEventListener('click', () => {
    window.location.hash = '#/login';
  });
}
const CreateAccBtn = document.getElementById('CreateAccBtn');
if (CreateAccBtn) { CreateAccBtn.addEventListener('click', () => {
    window.location.hash = '#/signup';
  });
}
const BackLgn = document.getElementById('Back');
if (BackLgn) { BackLgn.addEventListener('click', () => {
    window.location.hash = '#/';
  });
}
const onbNext = document.getElementById('onbNext');
if (onbNext) { onbNext.addEventListener('click', () => {
    window.location.hash = '#/onboarding';
  });
}
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault(); // e is the event object; preventDefault() stops the element’s default browser behavior (like following a link)
      logout();
    });
  }
}


// =======7. Auth Logic======
//   LOG IN LOGIC
// ==========================

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('Please fill in all fields');
    return;
  }

  // Here we have a fake delay and loading screen to simulate what happens if the server is awaiting a responce from an API
  state.isLoading = true;
  render();

  setTimeout(() => {
    state.user = username;   // we assing the global user state to the username entered during login
    state.isLoading = false;
    window.location.hash = '#/dashboard';
  }, 800);
}

// =======7. Auth Logic======
//   LOG OUT LOGIC
// ==========================


function logout() {
  // Ask the user for confirmation
  const confirmed = confirm("Do you really want to log out?");
  if (!confirmed) return; // user cancelled

  // If confirmed, proceed and change the global user state back to null
  state.user = null;

  if (window.location.hash === '#/login' || window.location.hash === '') {
    render(); // re-render Home in logged-out state
  } else {
    window.location.hash = '#/login'; // redirect to Home
  }
}
// ==========================
// 8. Bootstrapping - App Start
// ==========================

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
