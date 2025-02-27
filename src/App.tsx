import React, { useContext, useState } from "react";
import MainSection from "./component/mainSection";
import { BoostPage } from "./component/boostPage";
import TaskSection from "./component/taskSection";
import LoginPage from "./component/LoginPage";
import RegisterPage from "./component/RegisterPage";
import { GameContext } from "./context/GameContext";
import Header from "./component/header";
import FooterMain from "./component/footerMain";
import PlaytoWin from "./component/PlaytoWin";



const App = () => {
  const { currentView , isLoggedIn} = useContext(GameContext)!;



  return (
   
<div>
    <div className="flex flex-col h-[95vh] pt-2 justify-between font-roadrage items-center bg-gray-800 shadow-lg  bg-gradient-to-t from-black to-transparent">
      <div className="flex flex-col w-screen sm:w-[400px] p-2 border border-gray-800 border-opacity-70 rounded-md shadow-md">
        {/*app header area */ }     
          <div className="flex flex-col w-full">
          <Header/>
          </div>
        {/**main content area */}
          
        
        <main className="App-main w-full h-[65vh]">
          {currentView === "LoginPage" && (
            <LoginPage/>
          )}
          {currentView === "RegisterPage" && (
            <RegisterPage/>
          )}
          {isLoggedIn && currentView === "MainSection" && <MainSection />}
          {isLoggedIn && currentView === "BoostPage" && <BoostPage />}
          {isLoggedIn && currentView === "TaskPage" && <TaskSection />}
          {isLoggedIn && currentView === "PlayToWinPage" && <PlaytoWin />}
          {!isLoggedIn && currentView !== "LoginPage" && (
            <p>You are not logged in. Redirecting to Login Page...</p>
          )}
        
        </main>
        {/* FOOTER */
        <div className="relative bottom-0 left-0  mb-2 w-full"> 
          <div className="flex h-20">
            {currentView != "RegisterPage" && currentView != "LoginPage" && (
              <FooterMain />
            )}
          </div>
        </div>
        }
      </div>

    {/*modal for messages*/
      
      

    }
    </div>
   
  </div>
  );
};

export default App;
