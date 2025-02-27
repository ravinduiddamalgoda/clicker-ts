import React from "react";

interface Props {
    onButtonClick: () => void; // Define the prop type as a function
  }



const Info: React.FC<Props> = ({onButtonClick}) => {

    return (
        <div className="absolute inset-0 z-50  bg-black bg-opacity-95 text-white flex items-center justify-center p-2">
        <div className="flex flex-col w-screen sm:w-[400px] rounded  p-2 bg-blue-700 text-center font-roadrage font-extralight">
          <h2 className="text-xl mb-2 tracking-wider">How to Play Miner Game</h2>
          <div className="text-sm mb-2 space-y-4 tracking-wider">
            <div>
              <strong className="text-black font-bold">Basic Gameplay:</strong>
              <ul className="list-disc list-inside text-left">
                <li>Generate F$: Your miner automatically generates F$ over time.</li>
                <li>Speed Up Mining: Click on the miner to increase F$ generation speed.</li>
                <li>Upgrade Your Miner: Use F$ to upgrade your miner and boost its earning power.</li>
              </ul>
            </div>
            <div>
              <strong className="text-black font-bold">Boosting Your Mining:</strong>
              <ul className="list-disc list-inside text-left">
                <li>SHAMY Token Boost: Use SHAMY tokens to significantly increase your F$ generation rate for a specific duration.</li>
                <li>F$ Boost: Use F$ to temporarily boost your mining speed.</li>
              </ul>
            </div>
            <div>
              <strong className="text-black font-bold">Prize Draws:</strong>
              <ul className="list-disc list-inside text-left">
                <li>Eligibility: To participate in prize draws, you need to subscribe with 0.50 USD/USDT.</li>
                <li>Additional Entries: Purchase additional entries for 50 million F$ to increase your chances of winning.</li>
                <li>Level Reset: If your level is above 25, it will be reset to a level 10 lower after a draw.</li>
              </ul>
            </div>
            <div className="text-goldenYellow font-bold">
              <strong>Remember:</strong> Keep mining, upgrading, and boosting to maximize your F$ earnings and increase your chances of winning exciting prizes!
            </div>
          </div>
          <button
            className="bg-white text-black py-2 px-6 rounded-lg"
            onClick={onButtonClick}
          >
            Close
          </button>
          
        </div>
      </div>


    )


};

export default Info;