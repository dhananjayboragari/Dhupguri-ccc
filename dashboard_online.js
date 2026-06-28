import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getDatabase, ref, set, onDisconnect, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCZd10BUgRR9IEQ2kENQ_bXZiThegHRY-I",
  authDomain: "dhupguri-ccc.firebaseapp.com",
  databaseURL: "https://dhupguri-ccc-default-rtdb.firebaseio.com",
  projectId: "dhupguri-ccc",
  storageBucket: "dhupguri-ccc.firebasestorage.app",
  messagingSenderId: "278611213070",
  appId: "1:278611213070:web:f9652c7965f472164c355f"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  const userRef = ref(db, "status/" + user.uid);

  // ✅ online
  set(userRef, {
    state: "online",
    lastSeen: serverTimestamp()
  });

  // ✅ disconnect
  onDisconnect(userRef).set({
    state: "offline",
    lastSeen: serverTimestamp()
  });

  // ✅ update
  setInterval(() => {
    set(userRef, {
      state: "online",
      lastSeen: serverTimestamp() // ⚠️ eta change korlam
    });
  }, 20000);
});
