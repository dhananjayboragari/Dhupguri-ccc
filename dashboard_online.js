import { getDatabase, ref, set, onDisconnect, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const db = getDatabase();
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  const userRef = ref(db, "status/" + user.uid);

  // online
  set(userRef, {
    state: "online",
    lastSeen: serverTimestamp()
  });

  // disconnect hole
  onDisconnect(userRef).set({
    state: "offline",
    lastSeen: serverTimestamp()
  });

  // continuous update
  setInterval(() => {
    set(userRef, {
      state: "online",
      lastSeen: Date.now()
    });
  }, 20000);
});
