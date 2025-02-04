import React, { useContext, useState } from "react";
import MainSection from "./component/mainSection";
import { BoostPage } from "./component/boostPage";
import Footer from "./component/footer";
import TaskSection from "./component/taskSection";
import LoginPage from "./component/LoginPage";
import RegisterPage from "./component/RegisterPage";
import { GameContext } from "./context/GameContext";
import Subscription from "./component/Subscription";

const App = () => {
  const { currentView , isLoggedIn} = useContext(GameContext)!;

  return (
    <div className="App">
      <main className="App-main">
        {currentView === "LoginPage" && (
          <LoginPage/>
        )}
        {currentView === "RegisterPage" && (
          <RegisterPage/>
        )}
        {isLoggedIn && currentView === "MainSection" && <MainSection />}
        {isLoggedIn && currentView === "BoostPage" && <BoostPage />}
        {isLoggedIn && currentView === "TaskPage" && <TaskSection />}
        {isLoggedIn && currentView === "Subscription" && <Subscription />}
        {!isLoggedIn && currentView !== "LoginPage" && (
          <p>You are not logged in. Redirecting to Login Page...</p>
        )}
      </main>
      {/* <footer className="App-footer">
        <Footer />
      </footer> */}
    </div>
  );
};

export default App;
