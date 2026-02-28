import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = window.FIRE;
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const adminPanel = document.getElementById("adminPanel");
const recognitionPanel = document.getElementById("recognitionPanel");
const prizePanel = document.getElementById("prizePanel");

loginBtn.onclick = () => signInWithPopup(auth, provider);

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const teacherSnap = await getDoc(doc(db, "teachers", user.uid));
  const teacherData = teacherSnap.exists() ? teacherSnap.data() : null;

  if (teacherData?.isAdmin) adminPanel.classList.remove("hidden");
  recognitionPanel.classList.remove("hidden");
  prizePanel.classList.remove("hidden");

  setupListeners();
});

function setupListeners() {
  onSnapshot(collection(db, "teachers"), (snap) => {
    const select = document.getElementById("recipientSelect");
    select.innerHTML = "";
    snap.forEach(doc => {
      const data = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = data.name;
      select.appendChild(option);
    });
  });

  onSnapshot(collection(db, "prizes"), (snap) => {
    const select = document.getElementById("prizeSelect");
    select.innerHTML = "";
    snap.forEach(doc => {
      const data = doc.data();
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = `${data.name} (${data.cost} pts)`;
      select.appendChild(option);
    });
  });
}

document.getElementById("addTeacherBtn").onclick = async () => {
  const name = document.getElementById("teacherName").value;
  const email = document.getElementById("teacherEmail").value;
  await addDoc(collection(db, "teachers"), { name, email, bank: 0, earned: 0, isAdmin: false });
};

document.getElementById("addPrizeBtn").onclick = async () => {
  const name = document.getElementById("prizeName").value;
  const cost = parseInt(document.getElementById("prizeCost").value);
  await addDoc(collection(db, "prizes"), { name, cost });
};

document.getElementById("sendRecognitionBtn").onclick = async () => {
  const senderId = auth.currentUser.uid;
  const recipientId = document.getElementById("recipientSelect").value;
  const message = document.getElementById("messageInput").value;
  const points = parseInt(document.getElementById("pointsInput").value);
  await addDoc(collection(db, "recognitions"), { senderId, recipientId, message, points, timestamp: Date.now() });
};

document.getElementById("redeemPrizeBtn").onclick = async () => {
  const teacherId = auth.currentUser.uid;
  const prizeId = document.getElementById("prizeSelect").value;
  await addDoc(collection(db, "redemptions"), { teacherId, prizeId, timestamp: Date.now() });
};
