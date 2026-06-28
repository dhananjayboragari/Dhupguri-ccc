import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getDatabase, ref, set, onDisconnect, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  const userRef = ref(db, "status/" + user.uid);

  set(userRef, {
    state: "online",
    lastSeen: serverTimestamp()
  });

  onDisconnect(userRef).set({
    state: "offline",
    lastSeen: serverTimestamp()
  });

  setInterval(() => {
    set(userRef, {
      state: "online",
      lastSeen: Date.now()
    });
  }, 20000);
});
