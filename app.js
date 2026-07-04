<script>
import { getDatabase, ref, set, onDisconnect, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const db = getDatabase();
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if(user){
    const userStatusRef = ref(db, "status/" + user.uid);

    // online
    set(userStatusRef, {
      state: "online",
      lastSeen: serverTimestamp()
    });

    // auto offline (page close / app close)
    onDisconnect(userStatusRef).set({
      state: "offline",
      lastSeen: serverTimestamp()
    });

    // internet off hole
    window.addEventListener("offline", () => {
      set(userStatusRef, {
        state: "offline",
        lastSeen: serverTimestamp()
      });
    });

    // abar online hole
    window.addEventListener("online", () => {
      set(userStatusRef, {
        state: "online",
        lastSeen: serverTimestamp()
      });
    });
  }
});
</script>
