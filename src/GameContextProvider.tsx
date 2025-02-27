import { createContext, useState, useEffect, useMemo, ReactNode } from "react";
import { myConstants, handleSendVerificationLink,loginWithFirebase, registerWithFirebase, saveToFirebase, registerWithGoogleAuth, readFromFirebase, getFlags} from "./config/config";
import { GameContext } from "./context/GameContext";
import { connectAuthEmulator, getAuth, onAuthStateChanged,signOut} from "firebase/auth";
import {app} from "./firebase_config";


import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import { useEncryptedStorage } from "./component/hookFunctions";
import { useInMemorySessionStorage  } from "./component/hookFunctions";
import { error } from "console";



interface ProviderProps {
  children: ReactNode;
}
interface CheckUidWithAuthProps {
  uidToCheck: string;
}
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

interface userData {
  userId: string; 
  fCount: number;
  level: number;
  lastUpdated: number;
  completedTasks: Record<string, number>;
  activatedTasks: ActiveTaskArray[];  
  referalLink: string; 
}

interface SessionData {
  sessionId: string;
  userId: string;
}

  


export function Provider({ children }: ProviderProps) {
  //const [storedData, setStoredData] = useState<GameData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  //const [gameData, setGameData] = useState<GameData | null>(null);
  const [F$rate, setF$rate] = useState<number>(0);
  const [counter, setCount] = useState<number>(60);
  const [currentView, setCurrentView] = useState<string>("LoginPage");
  const [fCount, setfCount] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [userId, setUserId] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [showMessage, setShowMessage] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, number>>({});
  const [activeTaskArray, setActiveTaskArray] = useState<ActiveTaskArray[]>([]);
  const [sessionId, setSessionId, removeSessionId] = useEncryptedStorage('sessionId', null); 
  const {setSession, getSession, deleteSession} = useInMemorySessionStorage (); 
  const [isDraw, setIsDraw] = useState(false);
  const [referalLink, setReferalLink]  = useState<string>("");
  const [referCode, setReferCode] = useState<string | null>(null);

  



  const SessionManagement = async (userId: string) =>{  
    if (!setSessionId || (typeof setSessionId !== 'function')) { 
      console.error("Error: setSessionId is null or undefined.");
      return false; 
    } 
    const newSessionId = uuidv4();   
    const newSession: SessionData = {
      sessionId: newSessionId,
      userId: userId, 
    };

     setSession(newSession); 
  
    // Store the encrypted sessionId in the cookie
  
     setSessionId(newSessionId);  
  }

  const removeSession = async () => {

    if (!sessionId || !removeSessionId || (typeof sessionId === 'function') || (typeof removeSessionId !== 'function')  ) { 
      console.error("Error: setSessionId is null or undefined.");
      return false; 
    } 
    deleteSession(sessionId);    
    removeSessionId(sessionId);  
    
  }

  const getSessionData = async (): Promise<boolean> =>{
   
    if (!sessionId || !removeSessionId || (typeof sessionId === 'function') || (typeof removeSessionId !== 'function')  ) { 
      console.error("Error: SessionId is null or undefined.");
      return false; 
    }
  
    const currentSession = getSession(sessionId);// stored session data
    
    if(currentSession?.sessionId === sessionId){
      setUserId(currentSession?.userId);
      return true;
    }
    return false;    
  }

  const getGameUpdates = async ()=>{
       // check game updates
       const gameFlags = await getFlags();

       if (gameFlags?.draw === true) {
         setIsDraw(true);
       } else {
         setIsDraw(false);
       }
  }

  const setUserData = (userData: userData) =>{
    if (userData.activatedTasks && userData.activatedTasks.length > 0) {
      const currentTime = Date.now();    
      const updatedTasks = userData.activatedTasks.map((taskItem) => {
        const timeDifferenceInSeconds = Math.floor((currentTime - taskItem.task.startTime)/1000);
        const expectedProgress = timeDifferenceInSeconds * taskItem.task.rate;     

          return {
            task: {
              ...taskItem.task,
              progress: expectedProgress,
            },
          };
      });

      setActiveTaskArray(updatedTasks);
    } else {
      setActiveTaskArray([]);
    }

   
    setUserId(userData.userId);
    setfCount(userData.fCount);
    setLevel(userData.level); 
    setCompletedTasks(userData.completedTasks ?? {});
   
    setReferalLink(userData.referalLink);
    setCurrentView("MainSection");
    setIsLoggedIn(true); 
    setIsLoading(false);   
     
    const rate = myConstants.F$rate  + (myConstants.Growth_rate_per_level * userData.level);   
    setF$rate(rate);     

  }
  

  const handleGoogleAuth = async () => {    
    
    const data = await registerWithGoogleAuth();
 
    if(!data || !data.userId || data === null || data === undefined){ 
      console.log('login failed by the  google auth');
      setMessage(pre=> pre = "Login failed by Google. Sign in using a email address");
      setShowMessage(true);
      setIsLoading(false);    
      return;
    }
   // console.log('login success');

    if(!SessionManagement(data.userId)){
      setMessage(pre=> pre = "Start a new Session.");
      setShowMessage(true);
      setIsLoading(false);  
      return;
    }       
    getGameUpdates();
    if (data) {
      setUserData(data);      
    }else{
      console.log('User Not Found.' );  
      localStorage.removeItem("userId");     
      setIsLoading(false); 
      setCurrentView("LoginPage");
    }

  }

  const handleLogout = async () => {
    
    if (userId) {      
      try{
        await saveToFirebase({
          userId,
          fCount,
          level,
          lastUpdated: Date.now(),
          completedTasks: completedTasks || {},
          activatedTasks: activeTaskArray || {}
        });
        removeSession();
        console.log("Game data saved to Firebase.");

        const auth = getAuth(app);
        await signOut(auth); 
        console.log("Logged out successfully.");
        localStorage.removeItem("userId");  
        setUserId("");
      } catch (error) {
        console.error("error Saving Data", error);
      }finally {
        setIsLoggedIn(false);
        localStorage.removeItem("userId"); 
        setCurrentView("LoginPage");
      }
    }else {
      console.log("User already loged out.");
      setCurrentView("LoginPage");
    }
    setIsLoggedIn(false);
    
 
  }

  // sign in with an email link
  const handleLogin = async (email: string) => {
      setIsLoading(true);

      //check if already signed in with a nongoogle
    
      const data = await handleSendVerificationLink({email});      
        
      
      if(!data || data === null || data === undefined){ 
        console.log('Login failed by  link');
        setIsLoading(false);
        
        return;
      }

      if(!SessionManagement(data.userId)){
        setMessage(pre=> pre = "Start a new Session.");
        setShowMessage(true);
        setIsLoading(false);  
        return;
      }     
      // check game updates
      getGameUpdates();
      const userData = await readFromFirebase(data.userId);
      console.log(userData);
      if (userData) {
        setUserData(userData);       
      }else{
          console.log('User Not Found.' );  
          localStorage.removeItem("userId");     
          setIsLoading(false); 
          setCurrentView("LoginPage");

      }
  };


  //check whether a user is loggedin
  const checkUserLogin = async () => {
   // chack for user authenticated.  
    setIsLoading(true);

    const isSession = await getSessionData();
    if(isSession){   
   
     
      if (userId) {
        const userData = await readFromFirebase(userId);
        //console.log(userData);/
              
          if (userData) {   
            setUserData(userData);   
              
          }else{
            console.log('User Not Found.' );  
            localStorage.removeItem("userId");     
            setIsLoading(false); 
            setCurrentView("LoginPage");
          }
          
      } else {
        console.log('User Not Found.' );  
        localStorage.removeItem("userId");     
        setIsLoading(false); 
        setCurrentView("LoginPage");
      }
    }else{
      console.log("user not found. Login");    
    }
    

  };



  useEffect(() => {     
      checkUserLogin(); 
  }, []);


  useEffect(() => {
   
    if (!isLoggedIn) return;
  //console.log(isLoggedIn, userId);
 
    const interval = setInterval(() => {
     // console.log('Attempting to save to Firebase...');
      saveToFirebase({
        userId,
        fCount,
        level,
        lastUpdated: Date.now(),
        completedTasks: {...completedTasks},
        activatedTasks: {...activeTaskArray}
      });
    }, 1000); 
 //   console.log('Saved successfilly.');
  
  
    return () => clearInterval(interval);
  
  }, [fCount]); 




  const contextGameData = useMemo(
    () => ({
      fCount,
      level,
      myConstants,
      F$rate,
     // levelupRate,
      isLoading,
      currentView,
      message,
      showMessage,
      completedTasks,
      userId,
      referalLink,
      setUserId,
      setCurrentView,
      setMessage,
      setShowMessage,
      setfCount,
      setLevel,
      setF$rate,
      handleLogin,
    //  handleRegister,
      handleGoogleAuth,
      handleLogout,
      setCompletedTasks,
      isLoggedIn,
      setIsLoggedIn,
      setIsLoading,
      isDraw,
      setIsDraw,
      activeTaskArray,
      setActiveTaskArray,
      setReferalLink
   
     
    }),
    [fCount, level, myConstants, F$rate, isLoading,activeTaskArray]
  );

  useEffect(() => {
    
    const intervalId = setInterval(() => {
      setfCount((prevCount) => prevCount + F$rate);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [level]);



  return (
    <GameContext.Provider value={contextGameData}>{children}</GameContext.Provider>
  );

}




