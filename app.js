//state

const state = {
  user: null,
  isLoading: false,
  onboardingStep: 1,
  onboardingData: {},
  routineFilter: 'All',
  currentExerciseInd: 0,
  currentSetInd: 0,    
  completedSets: []
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
        <img src="resources/images/banner.png" alt="BusyCali" class="nav-banner">
      </nav>
    `;
  }

  const h = window.location.hash;

  return `
   <nav class="nav-top">
      <img src="resources/images/banner.png" alt="BusyCali" class="nav-banner">
    </nav>
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
  '#/end-workout': EndWorkout 
};

// Define protected routes list 
const protectedRoutes = ['#/dashboard', '#/profile', '#/Home','#/progress', '#/workout', '#/end-workout'];

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
    <div class="intro-page">
      <img src="resources/images/logo2.png" alt="BusyCali" class="intro-logo">
      <p class="intro-tagline">Calisthenics, for Busy People.</p>
      <div class="intro-btns">
        <button id="loginPg">Login</button>
        <button id="CreateAccBtn">Create Account</button>
      </div>
    </div>
  `;

}

function WorkoutView() {
  const routineID = parseInt(localStorage.getItem('activeWorkout'));
  const routine = ROUTINES.find(r => r.id === routineID);
  const isPreview = localStorage.getItem('previewMode') === 'true';

  if (!routine) {
    return `<p>No workout selected. <a href="#/routines">← Back to Routines</a></p>`;
  }

  // Preview screen
  if (isPreview) {
    const exerciseList = routine.exercises.map((e, i) => `
      <div class="exercise-preview-row">
        <span class="ex-num">${i + 1}</span>
        <span class="ex-name">${e.name}</span>
        <span class="ex-detail">${e.sets} sets × ${e.reps} reps</span>
      </div>
    `).join('');

    return `
      <button id="Back" class="back-btn">← Back</button>
      <h2>${routine.name}</h2>
      <p class="routine-meta">${routine.duration} · ${routine.fitnessLevel}</p>
      <h3>Exercises</h3>
      <div class="exercise-preview-list">
        ${exerciseList}
      </div>
      <button id="startWorkoutBtn" class="btn">START TRAINING</button>
    `;
  }

  // Active workout — set by set
  const exercise = routine.exercises[state.currentExerciseInd];
  const totalExercises = routine.exercises.length;
  const exerciseNum = state.currentExerciseInd + 1;
  const currentSet = state.currentSetInd + 1;
  const totalSets = exercise.sets;
  const isLastSet = state.currentSetInd === totalSets - 1;
  const isLastExercise = state.currentExerciseInd === totalExercises - 1;

  return `
    <p class="workout-progress-label">
      Exercise ${exerciseNum} of ${totalExercises} · Set ${currentSet} of ${totalSets}
    </p>

    <div class="exercise-card">
      <h2 class="exercise-name">${exercise.name}</h2>
      <p class="exercise-detail">Target: ${exercise.sets} sets × ${exercise.reps} reps</p>
    </div>

    <div class="set-tracker">
      <p class="set-label">Set ${currentSet} — How many reps did you complete?</p>
      <input 
        id="repsCompleted" 
        type="number" 
        placeholder="${exercise.reps}" 
        min="0" 
        max="99"
        class="reps-input"
      />
    </div>

    <div class="workout-nav-btns">
      ${isLastSet && isLastExercise
        ? `<button id="finishWorkout" class="btn">Finish Workout ✓</button>`
        : `<button id="nextSet" class="btn">Complete Set →</button>`
      }
      <a href="#/routines" class="link-text">Quit Workout</a>
    </div>
  `;
}

function EndWorkout() {
  const routineID = parseInt(localStorage.getItem('activeWorkout'));
  const routine = ROUTINES.find(r => r.id === routineID) || { name: 'Workout', exercises: [] };

  // Group completed sets by exercise for the summary
  const summaryHTML = routine.exercises.map(ex => {
    const sets = state.completedSets.filter(s => s.exercise === ex.name);
    const setsHTML = sets.map((s, i) => `
      <span class="set-summary-row">Set ${i + 1}: ${s.repsCompleted} reps</span>
    `).join('');

    return `
      <div class="end-exercise-summary">
        <p class="end-ex-name">${ex.name}</p>
        <div class="set-summary-list">${setsHTML}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="end-icon">🎉</div>
    <h2>Well Done!</h2>
    <p>You completed <strong>${routine.name}</strong></p>

    <div class="stats-row">
      <div class="stat-card">
        <p class="stat-num">${state.completedSets.length}</p>
        <p class="stat-label">Sets Done</p>
      </div>
      <div class="stat-card">
        <p class="stat-num">${state.completedSets.reduce((t, s) => t + s.repsCompleted, 0)}</p>
        <p class="stat-label">Total Reps</p>
      </div>
    </div>

    <h3>Your Session</h3>
    <div class="end-summary">
      ${summaryHTML}
    </div>

    <div class="end-actions">
      <a href="#/progress" class="btn">See Progress</a>
      <a href="#/routines" class="btn-secondary">Back to Routines</a>
    </div>
  `;
}
 function LogIn() {
  if (state.user) {
    window.location.hash = '#/dashboard';
    return '';
  }
  return `
    <div class="auth-page">
      <button id="Back" class="auth-back">← Back</button>
      <h1 class="auth-title">Login</h1>
      <input id="username" class="auth-input" placeholder="Username">
      <input id="password" class="auth-input" type="password" placeholder="Password">
      <p id="loginError" class="error-text"></p>
      <button id="loginBtn" class="auth-btn">Login</button>
      <p class="auth-link">Don't have an account? <a href="#/signup">Sign Up</a></p>
    </div>
  `;
}

function SignUp() {
  return `
    <div class="auth-page">
      <button id="Back" class="auth-back">← Back</button>
      <h1 class="auth-title">Create Account</h1>
      <input id="name" class="auth-input" placeholder="Name">
      <input id="username" class="auth-input" placeholder="Username">
      <input id="email" class="auth-input" placeholder="Email">
      <input id="password" class="auth-input" type="password" placeholder="Password">
      <p id="signupError" class="error-text"></p>
      <button id="signupBtn" class="auth-btn">Next</button>
      <p class="auth-link">Already have an account? <a href="#/login">Login</a></p>
    </div>
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
        <p class="stat-label">Workouts this Week</p>
      </div>
      <div class="stat-card">
        <p class="stat-num">${allWorkouts.length}</p>
        <p class="stat-label">Total Workout Sessions</p>
      </div>
    </div>
    <p class="section-title">Recommended For You</p>
    ${cardsHTML}
    <p style="text-align:center;margin-top:16px;font-size:0.82rem;">
      <a href="#/about" class="about-link">About BusyCali</a>
    </p>
    
      `;
}



function About() {
  return `
    <div class="page about-page">
      <h2>About BusyCali</h2>

      <div class="about-section">
        <h3>What is BusyCali?</h3>
        <p>BusyCali is a calisthenics training app built for people with busy lifestyles. It gives you structured bodyweight routines you can do anywhere. No gym, No equipment required. Track your workouts, monitor your progress, and build real strength at your own pace.</p>
      </div>

      <div class="about-section">
        <h3>Who is it Designed for?</h3>
        <p>BusyCali is for anyone who wants to get fit but struggles to find the time. Whether you're a complete beginner or looking to level up your bodyweight skills, BusyCali adapts to your fitness level and goals through a quick onboarding setup.</p>
      </div>

      <div class="about-section">
        <h3>Why Calisthenics?</h3>
        <p>Calisthenics uses your own bodyweight as resistance, making it one of the most accessible and effective training methods available. It builds functional strength, improves flexibility, and requires minimal space. Perfect for training at home, in a park, or while travelling.</p>
      </div>
    </div>
  `;
}
function Profile() {
  const profile = getProfile(state.user);
  const workouts = getWorkouts(state.user);
  const user = getUsers()[state.user] || {};

  // Avatar initials
  const initials = (user.name || state.user || '?').slice(0, 2).toUpperCase();

  return `
    <div class="profile-page">

      <div class="profile-avatar">${initials}</div>
      <p class="profile-name">${user.name || state.user}</p>
      <p class="profile-email">${user.email || ''}</p>

      <div class="profile-grid">
        <div class="profile-cell">
          <p class="profile-cell-label">Level</p>
          <p class="profile-cell-val">${profile.fitnessLevel || 'Not set'}</p>
        </div>
        <div class="profile-cell">
          <p class="profile-cell-label">Goal</p>
          <p class="profile-cell-val">${profile.fitnessGoal || 'Not set'}</p>
        </div>
        <div class="profile-cell">
          <p class="profile-cell-label">Age</p>
          <p class="profile-cell-val">${profile.age || 'Not set'}</p>
        </div>
        <div class="profile-cell">
          <p class="profile-cell-label">Height</p>
          <p class="profile-cell-val">${profile.height ? profile.height + ' cm' : 'Not set'}</p>
        </div>
        <div class="profile-cell">
          <p class="profile-cell-label">Weight</p>
          <p class="profile-cell-val">${profile.weight ? profile.weight + ' kg' : 'Not set'}</p>
        </div>
        <div class="profile-cell">
          <p class="profile-cell-label">Workouts</p>
          <p class="profile-cell-val">${workouts.length}</p>
        </div>
      </div>

      <div id="editForm" class="hidden">
        <input id="editAge" class="auth-input" type="number" placeholder="Age" value="${profile.age || ''}">
        <input id="editHeight" class="auth-input" type="number" placeholder="Height (cm)" value="${profile.height || ''}">
        <input id="editWeight" class="auth-input" type="number" placeholder="Weight (kg)" value="${profile.weight || ''}">
        <button id="saveProfileBtn" class="auth-btn">Save</button>
      </div>

      <button id="editBtn" class="auth-btn">Edit Profile</button>
      <button id="logoutBtn" class="big-btn" style="background:transparent;color:var(--primary-dk);border:2px solid var(--primary);margin-top:10px;">Log Out</button>

    </div>
  `;
}
function Progress() {
  const workouts = getWorkouts(state.user);

  if (workouts.length === 0) {
    return `
      <div class="progress-page">
        <h1>Progress</h1>
        <p>No workouts logged yet!</p>
        <a href="#/routines" class="btn">Start your first workout →</a>
      </div>
    `;
  }

  const now = new Date();
  const thisMonth = workouts.filter(w => {
    const d = new Date(w.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // Session cards — now show sets breakdown
  const sessionCards = workouts.slice().reverse().map(w => {
    const setsHTML = (w.completedSets || []).map((s, i) => `
      <span class="session-set-row">${s.exercise} — Set ${s.set}: ${s.repsCompleted} reps</span>
    `).join('');

    return `
      <div class="session-card">
        <div class="session-header">
          <p class="session-name">${w.routineName}</p>
          <p class="session-date">${new Date(w.date).toLocaleDateString('en-GB')}</p>
        </div>
        <div class="session-sets">
          ${setsHTML}
        </div>
      </div>
    `;
  }).join('');

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
          data-level="${l}">${l}</button>
      `).join('')}
    </div>
    ${visible.map(r => `
      <div class="routine-card">
        <div>
          <p class="routine-name">${r.name}</p>
          <p class="routine-meta">${r.duration} · ${r.fitnessLevel}</p>
        </div>
        <button class="view-btn btn" data-id="${r.id}">View routine</button>
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

// View routine — goes to preview
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('activeWorkout', btn.dataset.id);
      localStorage.setItem('previewMode', 'true');
      state.currentExerciseInd = 0;
      state.currentSetInd = 0;
      state.completedSets = [];
      window.location.hash = '#/workout';
    });
  });

 // Start Workout — clears preview mode, begins active
  const startWorkoutBtn = document.getElementById('startWorkoutBtn');
  if (startWorkoutBtn) startWorkoutBtn.addEventListener('click', () => {
    localStorage.setItem('previewMode', 'false');
    render();
  });

  // Active workout — next exercise
const nextExercise = document.getElementById('nextExercise');
if (nextExercise) nextExercise.addEventListener('click', () => {
  state.currentExerciseInd++;
  render();
});



 // Complete Set — saves reps, moves to next set or next exercise
  const nextSet = document.getElementById('nextSet');
  if (nextSet) nextSet.addEventListener('click', () => {
    const routineID = parseInt(localStorage.getItem('activeWorkout'));
    const routine = ROUTINES.find(r => r.id === routineID);
    const exercise = routine.exercises[state.currentExerciseInd];

    // Read reps — fall back to target if left blank
    const repsInput = document.getElementById('repsCompleted');
    const repsCompleted = parseInt(repsInput.value) || exercise.reps;

    // Save this set
    state.completedSets.push({
      exercise: exercise.name,
      set: state.currentSetInd + 1,
      repsCompleted
    });

    // Move to next set or next exercise
    if (state.currentSetInd < exercise.sets - 1) {
      state.currentSetInd++;
    } else {
      state.currentExerciseInd++;
      state.currentSetInd = 0;
    }

    render();
  });

  // Finish Workout — saves final set, logs to localStorage, goes to end screen
  const finishWorkout = document.getElementById('finishWorkout');
  if (finishWorkout) finishWorkout.addEventListener('click', () => {
    const routineID = parseInt(localStorage.getItem('activeWorkout'));
    const routine = ROUTINES.find(r => r.id === routineID);
    const exercise = routine.exercises[state.currentExerciseInd];

    // Save the final set
    const repsInput = document.getElementById('repsCompleted');
    const repsCompleted = parseInt(repsInput.value) || exercise.reps;
    state.completedSets.push({
      exercise: exercise.name,
      set: state.currentSetInd + 1,
      repsCompleted
    });

    // Build workout entry and save to localStorage
    const newEntry = {
      date: new Date().toISOString(),
      routineName: routine.name,
      completedSets: state.completedSets
    };
    const workouts = getWorkouts(state.user);
    workouts.push(newEntry);
    saveWorkouts(state.user, workouts);

    // Reset workout state
    state.currentExerciseInd = 0;
    state.currentSetInd = 0;

    window.location.hash = '#/end-workout';
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
