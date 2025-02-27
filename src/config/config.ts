import { getDatabase, ref, set, get, update, increment  } from "firebase/database";
import { getAuth, sendSignInLinkToEmail, signInWithEmailLink, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase_config";
import { error } from "console";

import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import { useSearchParams } from "react-router-dom";

interface Task {
  id: number;
  target: number;
  category: string;
  startTime: number; // start time
  rate: number; // F$rate at the time task is started
  progress: number;
}

interface ActiveTaskArray {
  task: Task;

}

// Define types for props used in saveToFirebase and readFromFirebase
interface FirebaseProps {
  userId: string; // Firebase Auth UID
  fCount: number;
  level: number;
  lastUpdated: number;
  completedTasks?: Record<string, number>;
  activatedTasks?: ActiveTaskArray[];
  //RefferalSubscriptionBonusState: boolean;
  
}

interface AuthProps {
  email: string;
//  password: string;
 // username?: string; // Optional username for registration
}

export const myConstants = {
  Max_Level: 50,
  F$rate: 20,
  miner_base_cost: 50000, // Level 1 miner cost
  level_up_base_multiplier: 5, // Level upgrade multiplier
  Growth_rate_per_level: 2, //  growth from the previous level
  F$_Multiplier: 5, // x5 boost multiplier
  $Shamy_Multiplier: 15, // x15 boost multiplier for shamy tokens
  F$_boost:500000, // boost value for F$
  ShamyBoost:10000, // No of Tokens needed for shamy boost
  Additional_entryCost: 5000000,
  Referral_Sign_Bonus: 500000,
  Referral_Subscribe_Bonus:1000000, // when a refered user buys a subscription, only valid for once 

  site_url:"https://clicker-ts.vercel.app/",
  referral_url:"https://clicker-ts.vercel.app/referalLogin",
  verify_url:"https://clicker-ts.vercel.app/verify"

  
}

// Save or update user data in the Realtime Database
export const saveToFirebase = async (props: FirebaseProps): Promise<void> => {
  //console.log('starting save to firebase');
  if(!props.userId || props.userId === undefined) return;
  
  const db = getDatabase(app);
  const userRef = ref(db, `UserData/Users/${props.userId}`);

  const snapshot = await get(userRef);
  
  if (snapshot.exists()) {
    // Update existing user
    await update(userRef, {
      fCount: props.fCount,
      level: props.level,
      lastUpdated: props.lastUpdated,
      completedTasks: props.completedTasks,
      activatedTasks: props.activatedTasks,
      
    })
    .then(() => {
   //   console.log("Data updated successfully");
      // alert("Data has been successfully updated!");
    })
    .catch((error) => {
      console.error("Error updating data:", error);
      // alert("An error occurred while updating the data. Please try again.");
    });
  } else {
    // Add new user
    await set(userRef, {
      fCount: props.fCount,
      level: props.level,
      lastUpdated: props.lastUpdated,
      completedTasks: props.completedTasks,
      activatedTasks: props.activatedTasks,
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
  //const data = snapshot.val()
 // console.log("READ FROM FIREBASE", data)
 if (snapshot.exists()){
  return snapshot.val();
 }else{
  return false;
 }
 
  
};

// Register a new user with Firebase Authentication and save user data
export const registerWithFirebase = async (props: AuthProps): Promise<void> => {
  // const auth = getAuth(app);
  // const db = getDatabase(app);

  // try {
  //   const userCredential = await createUserWithEmailAndPassword(auth, props.email, props.password);
  //   const userId = userCredential.user.uid;

  //   // Save initial user data to Realtime Database
  //   const userRef = ref(db, `UserData/Users/${userId}`);
  //   await set(userRef, {
  //     userName: props.username || "NewUser",
  //     fCount: 0,
  //     level: 1,
  //     lastUpdated: Date.now(),
  //   });

  //   console.log("User registered and data saved successfully");
  // } catch (error: any) {
  //   alert("Error: " + error.message);
  // }
};

// Log in a user with Firebase Authentication
export const loginWithFirebase = async (props: AuthProps): Promise<any> => {
  // const auth = getAuth(app);
  // try {
  //   const userCredential = await signInWithEmailAndPassword(auth, props.email, props.password);
  //   const userId = userCredential.user.uid;

  //   // Fetch user data after successful login
  //   const userData = await readFromFirebase(userId);
  //   console.log("User logged in successfully:", userData);
  //   return userData;
  // } catch (error: any) {
  //   alert("Error: " + error.message);
  //   return null;
  // }
};

export const registerWithGoogleAuth = async (): Promise<any> => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  try {
    const result = await signInWithPopup(auth, provider); // google authentication data
    

    if (!result.user) throw new Error("No user data received from Google authentication.");

    const userId = result.user.uid;
    
    
    // Check if the displayName is available
    const displayName = result.user.displayName || result.user.email?.split('@')[0] || "NewUser";
    //console.log("User Display Name:", displayName);

    // Check for a valid email address
    if (result.user.email && !isValidEmail(result.user.email)) {
      throw new Error("Invalid email address.");
    }

    const db = getDatabase(app);
    const userRef = ref(db, `UserData/Users/${userId}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      // User exists, update their last login timestamp and retrieve data
      await update(userRef, { lastUpdated: Date.now() });
      const userData = userSnapshot.val();
      //console.log("User logged in successfully:",userData);
      return {
        ...userData,
        userId, // Include userId for frontend usage
      };
      
    } else {
      const referalLink = uuidv4(); // 
      // if referal get referal data
      const referedBy = checkReferealCode(); 
      // User doesn't exist, create a new entry and return the data
      const newUser = {
        userName: displayName,
        fCount: 0,
        level: 1,
        lastUpdated: Date.now(),
        completedTasks: {},
        activatedTasks: [],
        referedBy:referedBy || null,
        referalLink: referalLink,
        RefferalSubscriptionBonusState: referedBy !== null,
      };
      await set(userRef, newUser);
      console.log("New user registered and logged in successfully:", newUser);
      return {
        ...newUser,
        userId, // Include userId for frontend usage
      };
    }
    
  } catch (error: any) {
    console.error("Google authentication error:", error);
    //alert(`Error: ${error.message}`);
    return null;
  }
};

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

const removeSpecialChars = (email: string): string => {
  // Regular expression to match special characters
  const regex =  /[^a-zA-Z0-9\s]/g;
  return email.replace(regex, '');
}


// register with a verification link
const auth = getAuth(app);


export const handleSendVerificationLink = async (props: AuthProps): Promise<any> => {
//test@i-shine.com.au
  const cleanEmail = removeSpecialChars(props.email); 
  
  const db = getDatabase(app);
  //check for NonGoogle verified Link  

  try {
    const userRef = ref(db, `UserData/EmailCheck/${cleanEmail}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) { // user email is authenticated
      const nonGoogleAuthData = userSnapshot.val();
     // console.log("User logged in successfully:",nonGoogleAuthData);
      if(nonGoogleAuthData.userId){
        return nonGoogleAuthData;     
      }
    }else{
      
      //request to verify and authnticate
      const actionCodeSettings = {
        // URL you want to redirect back to after verification
        url: myConstants.verify_url, // Replace with your actual URL
        handleCodeInApp: true // This is important for handling in the app
      };

      await sendSignInLinkToEmail(auth, props.email, actionCodeSettings);
      localStorage.setItem("emailForSignIn", props.email);        // Store the email locally so you can use it later when the user comes back
      
      alert("Verification email sent! Check your inbox to sign in.");
    }  
  } catch (error)
   { 
    console.error("Error sending verification email:", error);
    alert("Error sending verification email. Please try again.");
      return null; 
   
  }

};

export const addEmailafterAuth = async (props : AuthProps) : Promise<any> => {
 
  const db = getDatabase(app);
  try{
  const result = await signInWithEmailLink(auth, props.email, window.location.href);

  if(result.user.emailVerified){
    const userId = result.user.uid;
    //create user email snapshot
    const cleanEmail = removeSpecialChars(props.email);
    const userauthRef = ref(db, `UserData/EmailCheck/${cleanEmail}`);
    const emailAuth = { // add the email to avoid sending verification email everytime
      userId: userId,
      lastUpdated: Date.now(),
    };
    await set(userauthRef, emailAuth);
    const referalLink = uuidv4(); // 
    //create a new user with new user if a refcode is 
    const referedBy = checkReferealCode(); 
      
   
    const userRef = ref(db, `UserData/Users/${userId}`);
    const newUser = {
      userName: props.email,
      fCount: 0,
      level: 1,
      lastUpdated: Date.now(),
      completedTasks: {},
      activatedTasks: [],
      referedBy:referedBy ?? null,
      referalLink:referalLink,     
      RefferalSubscriptionBonusState: referedBy !== null,
    };
    await set(userRef, newUser);
    console.log("New user registered for non google auth sign in and logged in successfully:", newUser);

    return {
      ...newUser,
      userId, // Include userId for frontend usage
    };

  }else{
     console.log(" verify your email");
  }
  console.log(result);
  } catch (error){
    // if invalid action code try verifying again
    console.log(error);
    return null;
  }

};

export const getFlags = async (): Promise <any> =>{
  const db = getDatabase(app);
    const flagRef = ref(db, `Flags/`);
    const flagSnapshot = await get(flagRef);
   if(flagSnapshot.exists()){
    const flags = flagSnapshot.val();
    return flags;
   }else{
    return false;
   }
};

export const saveReferaltoFirebase =async (userId: string, referral: string)=>{
    const db = getDatabase(app);
    const refRef = ref(db, `Referral/${referral}`);
    const refSanpshot = await get(refRef);
  // save the referral code issuer details
    if(!refSanpshot.exists()){
      //add sharer
      const sharer = {
        sharer: userId, 

      };
      
      await set(refRef,sharer);
    }
    return;
};

const checkReferealCode = async () =>{
  if(!localStorage.getItem("referCode")){
    return;
  }
  const referCode = localStorage.getItem("referCode");

  const db = getDatabase(app);
  const refRef = ref(db, `Referral/${referCode}`);
  const refSanpshot = await get(refRef);

  if(refSanpshot.exists()){
    // get sharer details 
    updateSharerFCount(refSanpshot.val().sharer);
    return refSanpshot.val().sharer;
  }
  localStorage.removeItem("referCode");
};

async function updateSharerFCount(sharerUserId: string) {
  const db = getDatabase(app);
  try {
      const sharerRef = ref(db, `UserData/Users/${sharerUserId}`);
      const sharerRefSnapShot = await get(sharerRef);
      const fCount = sharerRefSnapShot.val().fCount;
     
      // Update the fCount balance using update()
      await update(sharerRef, {       
          "fCount": increment(myConstants.Referral_Sign_Bonus),
      });

      console.log(`Updated fCount for sharer ${sharerUserId} `);
  } catch (error) {
      console.error("Error updating fCount:", error);
  }
}




  
