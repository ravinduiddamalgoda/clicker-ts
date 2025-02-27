import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import { GlobalContextProps } from "../global";

interface Props {
    onButtonClick: () => void; // Define the prop type as a function
  }





const Message: React.FC<Props> = ({onButtonClick}) => {
    const {message, showMessage, setShowMessage} = useContext(GameContext) as GlobalContextProps;
   


    return(<>
        <div className="absolute inset-0 z-50  bg-black bg-opacity-95 text-white flex items-center justify-center p-2">
          <div className="flex flex-col w-screen sm:w-[400px] rounded  p-2 bg-blue-700 text-center font-roadrage font-extralight">
            <div >
                <div className="flex flex-col w-full sm:w-[370px] justify-center rounded bg-blue-700  p-1 ">                        
                    <div className="mb-3 text-md tracking-wider">{message}</div>
                  
                        <button
                              className="bg-white text-black p-2 rounded-sm"
                              onClick={onButtonClick}
                        >
                        Close
                        </button>
                </div>
             </div>
          </div>
        </div>
    </>)
}
export default Message;