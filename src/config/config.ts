import { getDatabase, ref, set, get, update } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase_config";

// Define types for props used in saveToFirebase and readFromFirebase
interface FirebaseProps {
  userId: string; // Firebase Auth UID
  userName: string;
  fCount: number;
  level: number;
  lastUpdated: number;
}

interface AuthProps {
  email: string;
  password: string;
  username?: string; // Optional username for registration
}

export const myConstants = {
  F$rate: 5,
  miner_base_cost: 100000, // Level 1 miner cost
  level_up_base_multiplier: 5, // Level upgrade multiplier
  Growth_rate_per_level: 0.035, // % growth from the previous level
  F$_Multiplier: 5, // x5 boost multiplier
  $Shamy_Multiplier: 15, // x15 boost multiplier for shamy tokens
};

// Save or update user data in the Realtime Database
export const saveToFirebase = async (props: FirebaseProps): Promise<void> => {
  const db = getDatabase(app);
  const userRef = ref(db, `UserData/Users/${props.userId}`);

  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    // Update existing user
    await update(userRef, {
      userName: props.userName,
      fCount: props.fCount,
      level: props.level,
      lastUpdated: props.lastUpdated,
    })
      .then(() => console.log("Data updated successfully"))
      .catch((error) => alert("Error: " + error.message));
  } else {
    // Add new user
    await set(userRef, {
      userName: props.userName,
      fCount: props.fCount,
      level: props.level,
      lastUpdated: props.lastUpdated,
    })
      .then(() => console.log("Data saved successfully"))
      .catch((error) => alert("Error: " + error.message));
  }
};

// Read user data from Firebase Realtime Database
export const readFromFirebase = async (userId: string): Promise<any> => {
  const db = getDatabase(app);
  const userRef = ref(db, `UserData/Users/${userId}`);

  const snapshot = await get(userRef);
  return snapshot.val();
};

// Register a new user with Firebase Authentication and save user data
export const registerWithFirebase = async (props: AuthProps): Promise<void> => {
  const auth = getAuth(app);
  const db = getDatabase(app);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, props.email, props.password);
    const userId = userCredential.user.uid;

    // Save initial user data to Realtime Database
    const userRef = ref(db, `UserData/Users/${userId}`);
    await set(userRef, {
      userName: props.username || "NewUser",
      fCount: 0,
      level: 1,
      lastUpdated: Date.now(),
    });

    console.log("User registered and data saved successfully");
  } catch (error: any) {
    alert("Error: " + error.message);
  }
};

// Log in a user with Firebase Authentication
export const loginWithFirebase = async (props: AuthProps): Promise<any> => {
  const auth = getAuth(app);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, props.email, props.password);
    const userId = userCredential.user.uid;

    // Fetch user data after successful login
    const userData = await readFromFirebase(userId);
    console.log("User logged in successfully:", userData);
    return userData;
  } catch (error: any) {
    alert("Error: " + error.message);
    return null;
  }
};
