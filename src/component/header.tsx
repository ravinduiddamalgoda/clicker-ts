import React, { useContext, useState } from "react";
import { GameContext } from "../context/GameContext";
import { GlobalContextProps } from "../global";
import NameLogo from '../assets/icons/minenwin.png';
import Info from "./info";
import Message from "./message";



const Header: React.FC = () => {
    const [showInfo, setShowInfo] = useState(false);
    const {showMessage,setShowMessage} = useContext(GameContext) as GlobalContextProps;
   

    const handleCloseButton = () =>{
      setShowInfo(false);
      setShowMessage(false);
    }

    return (
    <div>
      { showInfo && (
        <div className="flex flex-col w-screen sm:w-[400px] items-center justify-center">
          <Info onButtonClick={handleCloseButton}/>                   
        </div>
      )}

      { showMessage && (
          <div className="flex flex-col w-screen sm:w-[400px] items-center justify-center">
          <Message onButtonClick={handleCloseButton}/>                   
        </div>
      )}
        
            <div className="flex flex-row justify-between ">
            <div className="flex pl-2">
                <div className="text-2xl text-goldenYellow ">
                  <img src={NameLogo} alt="Name_logo"  />
                </div>          
            </div>
            <div className="flex pr-2">
                  <div className= "w-1/2">
                    <button
                      className="text-lg border-2 px-4 h-8 rounded-full text-white font-bold "
                      onClick={() => setShowInfo(true)}
                    >
                      i
                    </button>
                  </div>
            </div>
        </div>
    </div>

    );
};

export default Header;