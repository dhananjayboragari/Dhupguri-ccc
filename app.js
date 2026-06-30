<script>
  // ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyCZd10BUgRR9IEQ2kENQ_bXZiThegHRY-I",
  authDomain: "dhupguri-ccc.firebaseapp.com",
  databaseURL: "https://dhupguri-ccc-default-rtdb.firebaseio.com",
  projectId: "dhupguri-ccc",
  storageBucket: "dhupguri-ccc.appspot.com",
  messagingSenderId: "278611213070",
  appId: "1:278611213070:web:f9652c7965f472164c355f"
};

// ===== INIT SAFE =====
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();


// ===== MAIN SYSTEM =====
auth.onAuthStateChanged((user) => {

  if (!user) return;

  const userRef = db.ref("status/" + user.uid);
  const connectedRef = db.ref(".info/connected");

  // 🔥 CONNECT DETECT
  connectedRef.on("value", (snap) => {

    if (snap.val() === true) {

      // 🟢 ONLINE
      userRef.update({
        state: "online",
        lastSeen: firebase.database.ServerValue.TIMESTAMP
      });

      // 🔴 AUTO OFFLINE (tab close / app close / net off)
      userRef.onDisconnect().update({
        state: "offline",
        lastSeen: firebase.database.ServerValue.TIMESTAMP
      });

    }

  });

  // ===== 10 sec LIVE UPDATE (MAIN REQUIREMENT) =====
  setInterval(() => {
    userRef.update({
      lastSeen: firebase.database.ServerValue.TIMESTAMP,
      state: "online"
    });
  }, 10000);


  // ===== APP MINIMIZE / BACK / TAB SWITCH =====
  document.addEventListener("visibilitychange", () => {

    if (document.hidden) {
      // 🔴 MINIMIZE / BACK
      userRef.update({
        state: "offline",
        lastSeen: firebase.database.ServerValue.TIMESTAMP
      });
    } else {
      // 🟢 RETURN BACK
      userRef.update({
        state: "online",
        lastSeen: firebase.database.ServerValue.TIMESTAMP
      });
    }

  });


  // ===== PAGE CLOSE (extra safety) =====
  window.addEventListener("beforeunload", () => {
    userRef.update({
      state: "offline",
      lastSeen: firebase.database.ServerValue.TIMESTAMP
    });
  });


  // ===== USER ACTIVITY TRACK (scroll, click etc) =====
  function userActive() {
    userRef.update({
      lastSeen: firebase.database.ServerValue.TIMESTAMP,
      state: "online"
    });
  }

  ["click","scroll","keypress","touchstart"].forEach(event => {
    window.addEventListener(event, userActive);
  });

});
</script>
