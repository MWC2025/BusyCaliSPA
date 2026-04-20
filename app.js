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
        <a href="#/">Home</a>
        <a href="#/about">About</a>
        ${state.user ? `<a href="#/dashboard">Dashboard</a>` : ''}
      </div>
      <div class="nav-right">
        ${state.user 
          ? `<a href="#" id="logoutLink">Logout</a>` 
          : `<a href="#/login">Login</a>`}
      </div>
    </nav>
  `;
}
// ==========================
// 3. Route Map
// ==========================

const routes = {
  '#/': Home,
  '#/login': LogIn,
  '#/dashboard': Dashboard,
  '#/about': About
};

// Define protected routes list (what's behind the login)
const protectedRoutes = ['#/dashboard'];

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

function Home() {
  if (state.user) {
    return `
      <h1>Welcome back, <span style="color: #0593f2;">${state.user}</span></h1>
      <p> This is the Home page when the user is logged in </p>
    `;
  }

  return `
    <h1>Welcome</h1>
    <p>This is the Home Page</p>
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
    <h1>Login</h1>
    <input id="username" placeholder="Username"> <br> <br>
    <input id="password" type="password" placeholder="Password"> <br><br>
    <button id="loginBtn">Login</button>
  `;
}

function Dashboard() {
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

// ==========================
// 6. Event Binding
// ==========================

function attachEvents() {

  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) loginBtn.addEventListener('click', login);

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
