import React, { useState, useContext, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import Subscription from "./Subscription";





const Draw:  React.FC = () => {


    return (
        <>
    <div className="flex flex-col w-full items-center justify-center text-center">
    <div className="flex w-full justify-center ">
            Draw Name
    </div>
    
    <div className="flex w-full  ">
        <div className="flex w-1/2  justify-center">
        image 200 * 300
        </div>
        <div className="flex w-1/2  justify-center">
        <Subscription />
        </div>
    </div>
    <div className="flex w-fullp-2">

    </div>
    <div className="flex w-fullp-2">

    </div>
    </div>  
        
        
        
        
        
        </>
    )


}
export default Draw;