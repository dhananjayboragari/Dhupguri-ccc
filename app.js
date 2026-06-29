
alert("APP RUNNING");

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getDatabase, ref, update } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCZd10BUgRR9IEQ2kENQ_bXZiThegHRY-I",
  authDomain: "dhupguri-ccc.firebaseapp.com",
  databaseURL: "https://dhupguri-ccc-default-rtdb.firebaseio.com",
  projectId: "dhupguri-ccc",
  storageBucket: "dhupguri-ccc.firebasestorage.app",
  messagingSenderId: "278611213070",
  appId: "1:278611213070:web:f9652c7965f472164c355f"
};

// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// 🔐 AUTH + LAST SEEN SYSTEM
onAuthStateChanged(auth, (user) => {

  // ❌ login না থাকলে redirect
  if(!user){
    if(!window.location.pathname.includes("index.html")){
      window.location.href = "index.html";
    }
    return;
  }

  const userRef = ref(db, "status/" + user.uid);

  // 🔥 main update function
  function updateLastSeen(){
    update(userRef, {
      lastSeen: Date.now()
    });
  }

  // ✅ first run (delay fix)
  setTimeout(updateLastSeen, 1000);

  // ⏱️ auto update (main engine)
  setInterval(updateLastSeen, 10000);

  // 👆 user activity
  window.addEventListener("click", updateLastSeen);
  window.addEventListener("touchstart", updateLastSeen);

  // 📱 app resume
  document.addEventListener("visibilitychange", () => {
    if(document.visibilityState === "visible"){
      updateLastSeen();
    }
  });

});
