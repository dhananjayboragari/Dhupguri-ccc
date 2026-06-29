try {

  alert("APP RUNNING ✅");

  const firebaseConfig = {
    apiKey: "AIzaSyCZd10BUgRR9IEQ2kENQ_bXZiThegHRY-I",
    authDomain: "dhupguri-ccc.firebaseapp.com",
    databaseURL: "https://dhupguri-ccc-default-rtdb.firebaseio.com",
    projectId: "dhupguri-ccc",
    storageBucket: "dhupguri-ccc.appspot.com",
    messagingSenderId: "278611213070",
    appId: "1:278611213070:web:f9652c7965f472164c355f"
  };

  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  const db = firebase.database();

  auth.onAuthStateChanged((user) => {

    if (!user) return;

    const userRef = db.ref("status/" + user.uid);

    function updateLastSeen() {
      userRef.update({
        lastSeen: Date.now(),
        state: "online"
      });
    }

    updateLastSeen();
    setInterval(updateLastSeen, 10000);

    userRef.onDisconnect().update({
      state: "offline",
      lastSeen: Date.now()
    });

  });

} catch (e) {
  alert("ERROR: " + e.message);
}
