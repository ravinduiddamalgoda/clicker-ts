import React from "react";

interface Props {
    onButtonClick: () => void; // Define the prop type as a function
  }



const WinDetails: React.FC<Props> = ({onButtonClick}) => {

    return (
        <div className="absolute inset-0 z-50  bg-black bg-opacity-95 text-white flex items-center justify-center p-2">
        <div className="flex flex-col w-screen sm:w-[400px] rounded  p-2 bg-gray-800 shadow-lg  bg-gradient-to-t from-seablue to-blue-500 text-center font-roadrage font-extralight">
          <h2 className="text-xl text-magentaPurple mb-2 tracking-wider"><strong>How Mine&Win Draw Works.</strong></h2>
          <div className="text-sm space-y-4 tracking-wider">
            <div>
                <p>"Imagine a fun treasure hunt! Mine&Win is like that, instead of digging for gold, 
                    you're entering exciting draws to win amazing prizes like the latest phones, stylish watches, 
                    and even real gold!!! All you need to do is join and increase your chances of winning by getting more entries. 
                    It's like a lottery, but with a touch of adventure!"</p>

              <ul className="list-disc list-inside text-left mt-2">
              <strong className="text-black font-bold">It's Simple to Enter:</strong>
                <li>Eligibility: join with <strong>0.50</strong> usd/usdt.</li>
                <li>Earn F$ and get aditional entries to the draw.</li>
               
              </ul>
            </div>
            <div>             
              <ul className="list-disc list-inside text-left">
              <strong className="text-black font-bold">What you will Win:</strong>
                <li>Every draw will have different prizes.</li>
                <li>With more participants, More quantities of the prize will be added. </li>
              </ul>
            </div>
            <div>              
              <ul className="list-disc list-inside text-left">
              <strong className="text-black font-bold">Rules:</strong>
                <li>Eligibility: Join with 0.50 USD/USDT for each draw.</li>
                <li>Unlimited additional Entries.</li>              
                <li>Level Reset: If your level is above 35, it will be reset to a level 35 after a each draw.</li>
              </ul>
            </div>
            <div className="text-magentaPurple font-bold">
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

export default WinDetails;