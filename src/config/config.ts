import { getDatabase, ref, set, push, get, update, onValue } from "firebase/database";
import app from '../firebase_config';

// Define types for props used in saveToFirebase and readFromFirebase
interface FirebaseProps {
  userId: number;
  userName: string;
  fCount: number;
  level: number;
  lastUpdated: number;
}

export const myConstants = {
  F$rate: 5,
  miner_base_cost: 100000, // level 1 miner cost
  level_up_base_multiplier: 5, // level up grade multiplier
  Growth_rate_per_level: 0.035, // % growth from the previous level
  F$_Multiplier: 5, // x5 boost multiplier
  $Shamy_Multiplier: 15, // x15 boost multiplier for shamy tokens
};

export const savetoFirebase = async (props: FirebaseProps): Promise<void> => {
  const db = getDatabase(app);
  const userRef = ref(db, `UserData/Users/${props.userId}`);

  // Check if the user exists
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    // Update user
    await update(userRef, {
      userName: props.userName,
      fCount: props.fCount,
      level: props.level,
      lastUpdated: props.lastUpdated,
    })
      .then(() => {
        console.log("Data updated");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  } else {
    // Write new user
    const docRef = ref(db, "UserData/Users/" + props.userId);
    await set(docRef, {
      userName: props.userName,
      fCount: props.fCount,
      level: props.level,
      lastUpdated: props.lastUpdated,
    })
      .then(() => {
        console.log("Data saved successfully");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }
};

export const readfromFirebase = async (props: { userId: number }): Promise<any> => {
  const db = getDatabase(app);
  const userRef = ref(db, `UserData/Users/${props.userId}`);

  const snapshot = await get(userRef);
  return snapshot.val();
};
