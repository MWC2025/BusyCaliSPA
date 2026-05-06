//state

const state = {
  user: null,
  isLoading: false,
  onboardingStep: 1,
  onboardingData: {},
  routineFilter: 'All',
  currentExerciseInd: 0
};

// Local Storage

function getUsers(){
  return JSON.parse(localStorage.getItem('usersList') || '{}');
}

function saveUsers(users){
  localStorage.setItem('usersList', JSON.stringify(users));
}

function getProfile(username){
  const all = JSON.parse(localStorage.getItem('profileList') || '{}');  
  return all[username]|| {};
}

function saveProfile(username, info){
  const all = JSON.parse(localStorage.getItem('profileList') || '{}');  
  all[username] = info;
  localStorage.setItem('profileList', JSON.stringify(all));
}


function getWorkouts(username){
  const all = JSON.parse(localStorage.getItem('workoutList') || '{}');  
  return all[username]|| [];
}

function saveWorkouts(username, workouts){
  const all = JSON.parse(localStorage.getItem('workoutList') || '{}');  
  all[username] = workouts;
  localStorage.setItem('workoutList', JSON.stringify(all));
}
// Routines 
const ROUTINES = [
  {
    id: 1,
    name:'Push Routine',
    duration: '20 min',
    fitnessLevel:'Beginner',
    exercises: [
      { name: 'Push-ups', sets: 3, reps: 10 },
      { name: 'Dips', sets: 3, reps: 8 },
      { name: 'Pike Push-ups', sets: 3, reps: 6 }
    ]
  },

  {
    id: 2,
    name:'Pull Routine',
    duration: '30 min',
    fitnessLevel:'Beginner',
    exercises: [
      { name: 'Assisted Pull-ups', sets: 3, reps: 10 },
      { name: 'Chin-ups', sets: 3, reps: 8 },
      { name: 'Inverted rows', sets: 3, reps: 6 }
    ]
  },

  {
    id: 3,
    name:'Push Routine',
    duration: '20 min',
    fitnessLevel:'Intermediate',
    exercises: [
      { name: 'Archer Push-ups', sets: 3, reps: 6 },
      { name: 'Pseudo Planche Push-ups', sets: 3, reps: 8 },
      { name: 'Decline Push-ups', sets: 3, reps: 10 }
    ]
  },

  {
    id: 4,
    name:'Advanced Skills',
    duration: '20 min',
    fitnessLevel:'Advanced',
    exercises: [
      { name: 'Muscle-ups', sets: 3, reps: 5 },
      { name: 'Handstand Push-ups', sets: 3, reps: 8 },
      { name: 'L-sit Pull-ups', sets: 3, reps: 6 }
    ]
  }
]
// Navigation

function Nav() {
  if (!state.user) {
    return `
      <nav class="nav-top">
        <span class="nav-logo">BusyCali</span>
      </nav>
    `;
  }

  const h = window.location.hash;

  return `
    <nav class="bottom-nav">
      <a href="#/dashboard" class="nav-item ${h === '#/dashboard' ? 'active' : ''}">
        <span class="nav-label">Home</span>
      </a>
      <a href="#/routines" class="nav-item ${h === '#/routines' ? 'active' : ''}">
        <span class="nav-label">Routines</span>
      </a>
      <a href="#/progress" class="nav-item ${h === '#/progress' ? 'active' : ''}">
        <span class="nav-label">Progress</span>
      </a>
      <a href="#/profile" class="nav-item ${h === '#/profile' ? 'active' : ''}">
        <span class="nav-label">Profile</span>
      </a>
    </nav>
  `;
}

//Route list
const routes = {
  '#/': Intro,
  '#/login': LogIn,
  '#/dashboard': Home,
  '#/about': About,
  '#/profile': Profile,
  '#/onboarding': Onboarding,
  '#/progress': Progress,
  '#/signup' : SignUp,
  '#/routines' : Routines,
  '#/workout': WorkoutView,
};

// Define protected routes list 
const protectedRoutes = ['#/dashboard', '#/profile', '#/Home','#/progress', '#/workout'];

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

// render engine

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


// 5. Pages Components
//  if (state.user) checks if the user is logged in or not



function Intro() {
  return `
    <img src="resources/images/logo.png" alt="logo image">
    <p>Calisthenics, for Busy People.</p>
    

    <button id="loginPg">Login</button>
    <button id="CreateAccBtn">Create Account</button>


  `;
}

function WorkoutView() {
  const routineID = parseInt(localStorage.getItem('activeWorkout'));
  const routine = ROUTINES.find(r => r.id === routineID);

  if (!routine) {
    return `
      <div style="text-align:center;padding:40px 16px">
        <p>No workout selected.</p>
        <a href="#/routines">← Back to Routines</a>
      </div>`;
  }

  const exercise = routine.exercises[state.currentExerciseInd];
  const isLast = state.currentExerciseInd === routine.exercises.length - 1;
  const num = state.currentExerciseInd + 1;
  const total = routine.exercises.length;

  return `
    <p class="workout-counter">${routine.name} · Exercise ${num} of ${total}</p>
    <div class="exercise-card">
      <p class="exercise-name">${exercise.name}</p>
      <p class="exercise-detail">${exercise.sets} sets × ${exercise.reps} reps</p>
    </div>
    ${isLast
      ? `<button class="workout-next-btn" id="finishWorkout">Finish Workout ✓</button>`
      : `<button class="workout-next-btn" id="nextExercise">Next Exercise →</button>`}
    <a href="#/routines" class="workout-quit">Quit Workout</a>`;
}

function EndWorkout() {
  // shown after finishing a workout
  const routineID = parseInt(localStorage.getItem('activeWorkout'));
  const routine = ROUTINES.find(r => r.id === routineID) || { name: 'Workout', exercises: [] };
  return `
    <div class="end-page">
      <div class="end-icon">🎉</div>
      <h2 class="end-title">Well Done!</h2>
      <p class="end-sub">You completed ${routine.name}</p>
      <div class="stats-row" style="justify-content:center;">
        <div class="stat-card" style="max-width:150px;">
          <p class="stat-num">${routine.exercises.length}</p>
          <p class="stat-label">Exercises Done</p>
        </div>
      </div>
      <button class="big-btn" onclick="window.location.hash='#/progress'">See Progress</button>
      <br><br>
      <a href="#/routines" style="color:#6891A4;font-size:0.85rem;font-weight:600;display:block;text-align:center;">Back to Routines</a>
    </div>`;
}

function LogIn() {
  if (state.user) {
    return `
      <h1>Welcome back, <span style="color: #0593f2;">${state.user}</span></h1>
    `;
  }

  return `
    <button id="Back">Back</button>  
    <h1>Login</h1>
    
    <input id="username" placeholder="Username"> <br> <br>
    <input id="password" type="password" placeholder="Password"> <br><br>
    <p id="loginError" style="color:red; font-size:0.85rem;"></p>
    <button id="loginBtn">Login</button>
  `;
}

function SignUp() {
  return `
    <button id="Back">Back</button>  
    <h1>Create Account</h1>

    <input id="name" placeholder="Name"> <br><br>
    <input id="username" placeholder="Username"> <br><br>
    <input id="email" placeholder="Email"> <br><br>
    <input id="password" type="password" placeholder="Password"> <br><br>
    <p id="signupError" style="color:red; font-size:0.85rem;"></p>
    <button id="signupBtn">Next</button>
    <p>Already have an account? <a href="#/login">Login</a></p>
  `;
}

function Home() {
  
  const profile = getProfile(state.user);
  const allWorkouts = getWorkouts(state.user);

  // Work out greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Filterthis week's workouts
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  const thisWeek = allWorkouts.filter(w => new Date(w.date) >= startOfWeek);
  
  // Streak message
  const streakMsg = thisWeek.length > 0
    ? `You've trained ${thisWeek.length}x this week. Keep it up!`
    : `No workouts yet this week. Let's get started!`;

  //  recommended routines
  const userLevel = profile.fitnessLevel || 'Beginner';
  let recommended = ROUTINES.filter(r => r.fitnessLevel === userLevel).slice(0, 2);
  if (recommended.length === 0) recommended = ROUTINES.slice(0, 2);

  // cards HTML
  const cardsHTML = recommended.map(r => `
    <div class="routine-card">
      <div>
        <p class="routine-name">${r.name}</p>
        <p class="routine-meta">${r.duration} · ${r.fitnessLevel}</p>
      </div>
      <button class="btn btn-primary start-btn" data-id="${r.id}">Start</button>
    </div>
  `).join('');

  return `
       <h2 class="home-greeting">${greeting}, ${state.user}!</h2>
    <p class="home-sub">Ready for a workout?</p>
    <div class="streak-banner">  ${streakMsg}</div>
    <div class="stats-row">
      <div class="stat-card">
        <p class="stat-num">${thisWeek.length}</p>
        <p class="stat-label">This Week</p>
      </div>
      <div class="stat-card">
        <p class="stat-num">${allWorkouts.length}</p>
        <p class="stat-label">Total Sessions</p>
      </div>
    </div>
    <p class="section-title">Recommended For You</p>
    ${cardsHTML}
    <p style="text-align:center;margin-top:16px;font-size:0.82rem;">
      <a href="#/about" style="color:#578EA3;font-weight:600;">About BusyCali</a>
    </p>`;
}



function About() {
  return `
    <h1>About BusyCali</h1>
    <p>A calisthenics tracker for busy people. No gym needed.</p>
    <h3>Features</h3>
    <ul>
      >Onboarding to match your level</li>
      >Pre-built routines</li>
      >Workout logging</li>
      >Progress tracking</li>
      >Works offline — data stored locally</li>
    </ul>
  `;
}

function Profile() {
  const profile = getProfile(state.user);
  const workouts = getWorkouts(state.user);
  const user = getUsers()[state.user];

  return `
    <h1>${state.user}'s Profile</h1>
    <p>Email: ${user.email}</p>
    <p>Total Workouts: ${workouts.length}</p>
    <p>Level: ${profile.fitnessLevel || 'Not set'}</p>
    <p>Goal: ${profile.fitnessGoal || 'Not set'}</p>
    <p>Age: ${profile.age || 'Not set'}</p>
    <p>Height: ${profile.height || 'Not set'} cm </p>
    <p>Weight: ${profile.weight || 'Not set'} kg </p>

    <div id="editForm" class="hidden">
      <input id="editAge" type="number" placeholder="Age" value="${profile.age || ''}"><br><br>
      <input id="editHeight" type="number" placeholder="Height (cm)" value="${profile.height || ''}"><br><br>
      <input id="editWeight" type="number" placeholder="Weight (kg)" value="${profile.weight || ''}"><br><br>
      <button id="saveProfileBtn">Save</button>
    </div>

    <button id="editBtn">Edit Profile</button>
    <button id="logoutBtn">Log Out</button>
  `;
}
function Progress() {
  const workouts = getWorkouts(state.user);

  // Empty state — no workouts logged yet
  if (workouts.length === 0) {
    return `
      <div class="progress-page">
        <h1>Progress</h1>
        <p>No workouts logged yet!</p>
        <a href="#/routines">Start your first workout →</a>
      </div>
    `;
  }

  // Calculate this month's workouts
  const now = new Date();
  const thisMonth = workouts.filter(w => {
    const d = new Date(w.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // Build past session cards
  const sessionCards = workouts.map(w => `
    <div class="session-card">
      <p class="session-name">${w.routineName}</p>
      <p class="session-date">${new Date(w.date).toLocaleDateString('en-GB')}</p>
    </div>
  `).join('');

  // Single return with everything
  return `
    <div class="progress-page">
      <h1>Progress</h1>

      <div class="stats-row">
        <div class="stat-card">
          <p class="stat-label">This Month</p>
          <p class="stat-num">${thisMonth.length}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">Total Workouts</p>
          <p class="stat-num">${workouts.length}</p>
        </div>
      </div>

      <h3>Past Sessions</h3>
      <div class="session-list">
        ${sessionCards}
      </div>
    </div>
  `;
}
     

 
  


function Onboarding() {
  const step = state.onboardingStep;

  if (step === 1) {
    return `
      
      <div class="onb-bar-wrap"><div class="onb-bar" style="width:25%"></div></div>
      <h2>Quick Setup</h2>
      <p>What level are you currently at?</p>
      <div class="level-options">
        <button class="level-btn" data-value="Beginner">Beginner</button>
        <button class="level-btn" data-value="Intermediate">Intermediate</button>
        <button class="level-btn" data-value="Advanced">Advanced</button>
      </div>
      <p id="onbError" style="color:red; font-size:0.85rem;"></p>
      <button id="onbNext1">Next</button>
    `;
  }

  if (step === 2) {
    return `
      <button id="Back">← Back</button>
      <div class="onb-bar-wrap"><div class="onb-bar" style="width:50%"></div></div>
      <h2>Quick Setup</h2>
      <p>Your measurements (optional)</p>
      <input id="onbAge" type="number" placeholder="Age"> <br><br>
      <input id="onbHeight" type="number" placeholder="Height (cm)"> <br><br>
      <input id="onbWeight" type="number" placeholder="Weight (kg)"> <br><br>
      <button id="onbNext2">Next</button>
    `;
  }

  if (step === 3) {
    return `
      <button id="Back">← Back</button>
      <div class="onb-bar-wrap"><div class="onb-bar" style="width:75%"></div></div>
      <h2>Quick Setup</h2>
      <p>What is your fitness goal?</p>
      <div class="level-options">
        <button class="level-btn" data-value="Strength">Build Strength</button>
        <button class="level-btn" data-value="Weight Loss">Lose Weight</button>
        <button class="level-btn" data-value="Muscle Gain">Gain Muscle</button>
        <button class="level-btn" data-value="Flexibility">Flexibility</button>
      </div>
      <p id="onbError" style="color:red; font-size:0.85rem;"></p>
      <button id="onbNext3">Next</button>
    `;
  }

  if (step === 4) {
    return `
      <button id="Back">← Back</button>
      <div class="onb-bar-wrap"><div class="onb-bar" style="width:100%"></div></div>
      <h2>Quick Setup</h2>
      <p>What equipment do you have?</p>
      <div class="level-options">
        <button class="level-btn" data-value="None"> No Equipment</button>
        <button class="level-btn" data-value="Pull-up Bar"> Pull-up Bar</button>
        <button class="level-btn" data-value="Rings"> Rings</button>
        <button class="level-btn" data-value="Parallettes">Parallettes</button>
      </div>
      <p id="onbError" style="color:red; font-size:0.85rem;"></p>
      <button id="onbFinish">Get Started!</button>
    `;
  }
}

function Routines() {
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const visible = state.routineFilter === 'All'
    ? ROUTINES
    : ROUTINES.filter(r => r.fitnessLevel === state.routineFilter); 
  return `
    <h2>Routines</h2>
    <div class="filter-btns">
      ${levels.map(l => `
        <button class="filter-btn ${state.routineFilter === l ? 'active' : ''}"
          data-level="${l}" id="filter${l}">${l}</button>
      `).join('')}
    </div>
    ${visible.map(r => `
      <div class="routine-card">
        <div>
          <p class="routine-name">${r.name}</p>
          <p class="routine-meta">${r.duration} · ${r.fitnessLevel}</p>
        </div>
        <button class="start-btn btn" data-id="${r.id}">Start</button>
      </div>
    `).join('')}
  `;
}


// Event Binding

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
if (BackLgn) BackLgn.addEventListener('click', () => {

  // If on onboarding, go back a step instead of leaving the page
  if (window.location.hash === '#/onboarding') {
    if (state.onboardingStep > 1) {
      state.onboardingStep--;  
      render();                // render shows the previous step
    } else {
      // On step 1 — back exits onboarding entirely
      window.location.hash = '#/signup';
    }
    return;
  }

  // All other pages with a Back button — go to intro
  window.location.hash = '#/';
});

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', logout);



const signupBtn = document.getElementById('signupBtn'); 
if (signupBtn) signupBtn.addEventListener('click', signup);

document.querySelectorAll('.start-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    localStorage.setItem('activeWorkout', id);
    window.location.hash = '#/workout';
  });
});

document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
  });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    state.routineFilter = btn.dataset.level; // reads the data-level attribute
    render();
  });
});

// onboarding events 
const onbNext1 = document.getElementById('onbNext1');
if (onbNext1) onbNext1.addEventListener('click', () => {
  const selected = document.querySelector('.level-btn.selected');
  if (!selected) { document.getElementById('onbError').textContent = 'Please select a level'; return; }
  state.onboardingData.fitnessLevel = selected.dataset.value;
  state.onboardingStep = 2;
  render();
});

const onbNext2 = document.getElementById('onbNext2');
if (onbNext2) onbNext2.addEventListener('click', () => {
  state.onboardingData.age    = document.getElementById('onbAge').value;
  state.onboardingData.height = document.getElementById('onbHeight').value;
  state.onboardingData.weight = document.getElementById('onbWeight').value;
  state.onboardingStep = 3;
  render();
});

const onbNext3 = document.getElementById('onbNext3');
if (onbNext3) onbNext3.addEventListener('click', () => {
  const selected = document.querySelector('.level-btn.selected');
  if (!selected) { document.getElementById('onbError').textContent = 'Please select a goal'; return; }
  state.onboardingData.fitnessGoal = selected.dataset.value;
  state.onboardingStep = 4;
  render();
});

const onbFinish = document.getElementById('onbFinish');
if (onbFinish) onbFinish.addEventListener('click', () => {
  const selected = document.querySelector('.level-btn.selected');
  if (!selected) { document.getElementById('onbError').textContent = 'Please select an option'; return; }
  state.onboardingData.equipment = selected.dataset.value;
  saveProfile(state.user, state.onboardingData);
  state.onboardingStep = 1;
  state.onboardingData = {};
  window.location.hash = '#/dashboard';
});

  const nextExercise = document.getElementById('nextExercise');
  if (nextExercise) nextExercise.addEventListener('click', () => {
    state.currentExerciseInd++;
    render();
  });

  const finishWorkout = document.getElementById('finishWorkout');
  if (finishWorkout) finishWorkout.addEventListener('click', () => {
    const routineID = parseInt(localStorage.getItem('activeWorkout'));
    const routine = ROUTINES.find(r => r.id === routineID);
    const newEntry = {
      date: new Date().toISOString(),
      routineName: routine.name,
      exercises: routine.exercises
    };
    const workouts = getWorkouts(state.user);
    workouts.push(newEntry);
    saveWorkouts(state.user, workouts);
    state.currentExerciseInd = 0;
    window.location.hash = '#/progress';
  });

  const editBtn = document.getElementById('editBtn');
if (editBtn) editBtn.addEventListener('click', () => {
  document.getElementById('editForm').classList.toggle('hidden');
});

const saveProfileBtn = document.getElementById('saveProfileBtn');
if (saveProfileBtn) saveProfileBtn.addEventListener('click', () => {
  saveProfile(state.user, {
    ...getProfile(state.user),
    age: document.getElementById('editAge').value,
    height: document.getElementById('editHeight').value,
    weight: document.getElementById('editWeight').value
  });
  render();
});
}




//   LOG IN LOGIC


function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const users = getUsers();

//validation check
  if (!username || !password) {
    document.getElementById('loginError').textContent = 'Please fill in all fields';
    return;
  }

  if (!users[username] || users[username].password !== password) {
    document.getElementById('loginError').textContent = 'no account found!';
    return;
  }
  //  fake delay and loading screen 
  state.isLoading = true;
  render();

  setTimeout(() => {
    state.user = username;   // adding the global user state to the username entered during login
    localStorage.setItem('current_user', username);
    state.isLoading = false;
    window.location.hash = '#/dashboard';
  }, 800);
}


//   LOG OUT LOGIC



function logout() {
  // Ask the user for confirmation
  const confirmed = confirm("Do you really want to log out?");
  if (!confirmed) return; // user cancelled

  // If confirmed, proceed and change the global user state back to null
  state.user = null;
  localStorage.removeItem('current_user');

  if (window.location.hash === '#/login' || window.location.hash === '') {
    render(); // re-render Home in logged-out state
  } else {
    window.location.hash = '#/login'; // redirect to Home
  }
}


// sign up logic

function signup(){
  const name = document.getElementById('name').value;
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if ( !name || !username || !password ||!email ) {
    document.getElementById('signupError').textContent = 'Please fill in all fields';
    return;
  }

 const users = getUsers();
  if (users[username]) {
    document.getElementById('signupError').textContent = 'Username already taken';
    return;
  }

  users[username] = { name, email, password };
  saveUsers(users);

  state.user = username;
  localStorage.setItem('current_user', username);
  window.location.hash = '#/onboarding';
}

// Bootstrapping - App Start


window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
  const saved = localStorage.getItem('current_user');
  if (saved) state.user = saved;
  router();
});
