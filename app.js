import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getDatabase, ref, set } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔥 তোর Firebase config
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

// 🔐 AUTH + STATUS SYSTEM
onAuthStateChanged(auth, (user) => {

  // ❌ login না থাকলে login page-এ পাঠাবে
  if(!user){
    if(!window.location.pathname.includes("index.html")){
      window.location.href = "index.html";
    }
    return;
  }

  // ✅ user logged in
  const userRef = ref(db, "status/" + user.uid);

  function updateStatus(isOnline){
    set(userRef, {
      online: isOnline,
      lastSeen: Date.now()
    });
  }

  // 🔥 app open হলে
  updateStatus(true);

  // ⏱️ auto update
  setInterval(() => updateStatus(true), 15000);

  // 👆 user activity
  window.addEventListener("click", () => updateStatus(true));
  window.addEventListener("touchstart", () => updateStatus(true));

  // 📱 app background/foreground
  document.addEventListener("visibilitychange", () => {
    if(document.visibilityState === "visible"){
      updateStatus(true);
    } else {
      updateStatus(false);
    }
  });

  // ❌ page close (সবসময় কাজ নাও করতে পারে)
  window.addEventListener("beforeunload", () => {
    updateStatus(false);
  });

});
