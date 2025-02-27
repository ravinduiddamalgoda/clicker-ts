import React, { useEffect } from 'react';
import { app } from "../firebase_config";
import {addEmailafterAuth} from "../config/config";
import { getDatabase, ref, set, get, update } from "firebase/database";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // For redirection

const auth = getAuth(app);

const removeSpecialChars = (email: string): string => {
  // Regular expression to match special characters
  const regex =  /[^a-zA-Z0-9\s]/g;
  return email.replace(regex, '');
}

const VerifyEmail = () => {
  const navigate = useNavigate(); // For redirection
  const db = getDatabase(app);
  //const userRef = ref(db, `UserData/Users/${userId}`);

 // localStorage.removeItem('emailForSignIn');
  useEffect(() => {
    const handleSignInWithLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = localStorage.getItem('emailForSignIn');
       
        if (!email) {
          alert("Email not found. Please enter your email again.");
          navigate('/'); // Redirect to login if email is missing
          return;
        }
        //localStorage.removeItem('emailForSignIn');

         try {
          const userData = await addEmailafterAuth({email});
          
          if(!userData || !userData.userId || userData === null || userData === undefined){ 
            localStorage.removeItem('emailForSignIn');
            navigate('/'); // Redirect to login on error
            return null;
          }
          // after auth and creating a new user set
          console.log(userData.userId);
          //localStorage.setItem('userId',userData.userId)
          navigate('/'); // reload window
         


         } catch (error) {
           console.error("Error signing in with email link:", error);
        //   alert("Error signing in. Please try again.");
           navigate('/'); // Redirect to login on error
         }
      } else {
        // Handle cases where the user comes to /verify without a valid sign-in link.
        // Perhaps redirect them to the login page or show an appropriate message.c
        console.log("Invalid sign-in link.");
        navigate('/'); // Or another appropriate action
      }
    };
    handleSignInWithLink();
    }, []);
    

 

  return (
    <div>
      <h1>Verifying your email...</h1> {/* Or a loading indicator */}
    </div>
  )
};

export default VerifyEmail;