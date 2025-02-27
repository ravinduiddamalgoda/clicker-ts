import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import { GlobalContextProps } from "../global";
import { myConstants, readFromFirebase} from "../config/config";
import ReferralLinkShare from "./referralLinkShare";
import Day from '../assets/icons/day.png';
import Month from '../assets/icons/month.png';
import Week from '../assets/icons/week.png';
import {NumberWithCommas} from "./hookFunctions";



const dailyTasks = [
    { id: 1, target: 1000, category: "daily", startTime:0, rate: 0, progress:0 },
    { id: 2, target: 5000, category: "daily", startTime:0, rate: 0, progress:0  },
    { id: 3, target: 10000, category: "daily", startTime:0, rate: 0, progress:0  },
    { id: 4, target: 25000, category: "daily", startTime:0, rate: 0, progress:0  },
    { id: 5, target: 50000, category: "daily", startTime:0, rate: 0, progress:0  },
   
];

const weeklyTasks = [
    { id: 1, target: 100000, category: "weekly", startTime:0, rate: 0, progress:0 },
    { id: 2, target: 250000, category: "weekly", startTime:0, rate: 0, progress:0  },
    { id: 3, target: 500000, category: "weekly", startTime:0, rate: 0, progress:0  },
    
];

const monthlyTasks = [
    { id: 1, target: 1000000, category: "monthly", startTime:0, rate: 0, progress:0  },
    { id: 2, target: 2500000, category: "monthly", startTime:0, rate: 0, progress:0  },
    { id: 3, target: 5000000, category: "monthly", startTime:0, rate: 0, progress:0  },
    { id: 4, target: 10000000, category: "monthly", startTime:0, rate: 0, progress:0  },
];

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


const TaskSection: React.FC = () => {
    const { F$rate, fCount, completedTasks,activeTaskArray, referalLink,userId, setActiveTaskArray,setCompletedTasks,setShowMessage, setMessage,setfCount } = useContext(GameContext) as GlobalContextProps;
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    
    
    //activeTask?.rate * ((currentTime - activeTask.startTime)/1000)


    const taskProgress = activeTask && activeTask.startTime !== null
        ? Math.min(((activeTask?.progress) / activeTask.target) * 100, 100)
        : 0;

    const getStartOfDay = () => {
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
        return oneDayInMilliseconds;
    };

    const getStartOfWeek = () => {
        const oneWeekInMilliseconds = 7 * getStartOfDay();
        return oneWeekInMilliseconds;
    };

    const getStartOfMonth = () => {
        const oneMonthInMilliseconds = 30 * getStartOfDay();
        return oneMonthInMilliseconds;
    };

    
    const getStartOfCurrentPeriod = () => {
        switch (activeCategory) {
            case "daily":
                return getStartOfDay();
            case "weekly":
                return getStartOfWeek();
            case "monthly":
                return getStartOfMonth();
            default:
                return 0;
        }
    };

    const isTaskRefreshable = (taskId: number) => {
        const taskKey = `${activeCategory}-${taskId}`;
        const now = new Date();
        const startOfPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
        const lastCompletionTime = completedTasks[taskKey];

        const timeDifference = Math.abs(lastCompletionTime - startOfPeriod);
        

        if(!lastCompletionTime || timeDifference > getStartOfCurrentPeriod()){ // this will get no of hours for a day week n month
            
            return true;
        }
        return false;        

    };

    const isCategoryTaskActivated = (category: string) =>{

        if (!activeTaskArray || activeTaskArray.length === 0) {
            return false; 
          }
        
          return activeTaskArray.some(item => item.task.category === category); 

    };

    const handleStartTask = (task: Task) => {  
        
        if (!activeCategory) return;     
   
        if (isCategoryTaskActivated(activeCategory)) {  
            setMessage(pre=> pre = `Finish the current task in ${activeCategory} Tasks, before starting a new one!`);
            setShowMessage(true);
            return;
        }


        if (!isTaskRefreshable(task.id)) {
            
            setMessage(pre => pre = `You can only complete this task once per ${activeCategory}!`);
            setShowMessage(true);
            return;
        }

        //setActiveTask(task);      -- set in the aarray        
        handleActiveTasKArray(task);  // activate task for wach catagory and start count the progress 
        
    };

    const handleActiveTasKArray = (task: Task) => {
        if(!activeCategory) return;
       
        const selectedTask: ActiveTaskArray = { 
            task: { 
              id: task.id,
              target: task.target,
              category: task.category,
              startTime: Date.now(),
              rate: F$rate,
              progress: 0,
            }
          };
        setActiveTask(selectedTask.task);

        
        setActiveTaskArray((prev) => {
          if (!prev) {           
            return [ selectedTask ]; 
          } else {
            // Check if the category is already activated
            const isCategoryActivated = prev.some((item) => item.task.category === task.category);
      
            if (!isCategoryActivated) {
              return [...prev,  selectedTask ]; 
            } else {
                
              return prev; 
            }
          }
        });
      
    };

    
    const getActiveTask = (category: string) =>{
      
        if (!activeTaskArray || activeTaskArray.length === 0) {
            return false; 
          }
      
          const foundCategory = activeTaskArray.find(item => item.task.category === category);
          
          if(foundCategory){            
           setActiveTask(foundCategory.task);
         }else{
            return null;
         }

    };

    
    const getTasksForCategory = () => {       
        switch (activeCategory) {
            
            case "daily":              
                return dailyTasks;
            case "weekly":               
                return weeklyTasks;
            case "monthly":              
                return monthlyTasks;
            default:
                return [];
        }
    };

    const toggleCategory = (category: string) => {
        setActiveCategory((prev) => (prev === category ? null : category));
        getActiveTask(category);
       
    };

    
    // const completeTask = () => {
    //     if (!activeTask || activeTask.startTime === null ) return;

    //     const reward = 2 * activeTask.target;

    //     setfCount((prev) => prev + reward);
       
    //     setMessage(pre => pre = `Task completed! You earned ${reward} F$ as a reward.`);
    //     setShowMessage(true);

    //     const currentCategory = activeCategory || "";
    //     setCompletedTasks((prev) => ({
    //         ...prev,
    //         [`${currentCategory}-${activeTask.id}`]: Date.now(),
    //     }));

    //     setActiveTaskArray((prev) => {
    //         if (!prev) return []; 
    //         return prev.filter((item) => item.task.target !== activeTask.target); 
    //       });

    //     setActiveTask(null); 
       
    // };



    useEffect(() => {
    //    console.log(activeTaskArray);
     //   console.log(activeTask);
        if (activeTask && activeTask.startTime !== null ) {     
           
                const progress = activeTask.progress+activeTask?.rate ;  
          // console.log(progress);
              
                
            setActiveTaskArray((prev) => 
                prev?.map((element) => ({ 
                ...element,
                task: {
                   ...element.task,    
                progress:(progress)   }              
                })) || [] 
            );

                           
            setActiveTask((prev) => 
                prev ? 
                { ...prev, progress } 
                : null 
            );
       
            setActiveTaskArray((prev) => {
                if (!prev) return []; 
                const completedTasks = prev.filter((element) => element.task.progress >= element.task.target);
                
                if(completedTasks){
              
                    completedTasks.forEach(completed => {
                        if(completed.task.target === activeTask?.target){
                            setActiveTask(null);
                        }
                        const reward = 2 * completed.task.target;
                        setfCount((prev) => prev + reward);
                        setMessage(pre => pre = `Task ${completed.task.category} Mine ${completed.task.target} completed! You earned ${reward} F$ as a reward.`);
                        setShowMessage(true); 
                        // Update completedTasks state
                        setCompletedTasks((prev) => ({
                            ...prev,
                            [`${completed.task.category}-${completed.task.id}`]: Date.now(),
                        }));
    
                    });
                    
                }
           
            
                const remainingTasks = prev.filter((element) => element.task.progress < element.task.target); 
            
                return remainingTasks.length > 0 ? remainingTasks : []; 
              });

            


           

            
        }
    }, [fCount]);

    
    return (
       
     
        <div className="flex flex-col w-full items-center justify-center text-center">
        
                         
            <div className="flex flex-row mt-5 justify-center w-full">
                <div className="text-3xl text-goldenYellow">
                     F$: {fCount/*toFixed(2)*/}
                </div>
            </div>

            <div className="flex gap-2 font-roadrage text-lg text-white pl-2 pr-2 mt-5">
                <div className="flex gap-4 ">
                        <button
                            onClick={() => toggleCategory("daily")}
                            className="flex gap-4 justify-center items-center px-4 py-2 bg-card rounded"
                        >
                            <img src={Day} className="w-10" />
                            Daily Tasks
                        </button>
                        <button
                            onClick={() => toggleCategory("weekly")}
                            className="flex gap-4 justify-center items-center px-4 py-2 bg-card rounded"
                        >
                            <img src={Week} className="w-10" />
                            Weekly Tasks
                        </button>
                        <button
                            onClick={() => toggleCategory("monthly")}
                            className="flex gap-4 justify-center items-center px-4 py-2 bg-card rounded"
                        >
                            <img src={Month} className="w-10" />
                            Monthly Tasks
                        </button>
                    </div>
                
                
            </div>

            {/* {(activeCategory && !isTaskRunning) && ( */}
            {activeCategory  && (
                                <div className="text-xl text-white mt-5">
                    {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Tasks
                    <ul>
                        {getTasksForCategory().map((task) => (
                            <li key={task.id} className="w-[300px] mt-2">
                                {/** change the visible catgoary and set the task of visible category */ }
                                {/*getActivatedTarget(activeCategory)*/ activeTask?.target === task.target ? (
                                    <>
                                    <div
                                    className="flex w-full rounded font-thin bg-transparent  border border-blue-500  "                                        
                                    >
                                        <span
                                            className="felx bg-magentaPurple  rounded transition-all duration-300 text-md text-magentaPurple truncate"
                                            style={{ width: `${taskProgress}%` }}
                                        ></span>
                                       <span className="text-xs z-150">Task Progress: {activeTask?.progress} / {activeTask?.target}</span>
                                    </div>
                               
                                    </>
                                ): (<>
                                <button
                                    onClick={() => handleStartTask(task)}
                                   disabled = {activeTask?.target === task.target}
                                    // disabled={!!activeTask} , ${activeTask?.id === task.id
                                    className="rounded font-thin w-[300px] border border-blue-500 tracking-widest bg-gradient-to-l from-card to-transparent"
                                >
                                    Mine {NumberWithCommas(task.target)} F$
                                </button></>)}
                                
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* {activeTask && (
                <div className="mt-4 text-white">
                    <div>
                        Task Progress: {fCount - (taskStartFCount || 0)} / {activeTask.target}
                    </div>
                    <div className="bg-charcoalGray h-3 rounded-full shadow-glow w-4/5 mt-2 mb-5">
                        <div
                            className="bg-magentaPurple h-full rounded-full transition-all duration-300"
                            style={{ width: `${taskProgress}%` }}
                        ></div>
                    </div>
                </div>
            )} */}
            
               
            {activeCategory ? null : (  
                <div className="flex flex-col gap-4 mt-10">          
                    <div>
                        <div className="text-white text-3xl mb-2">Share Referrel</div>
                        <ReferralLinkShare userId = {userId} referralLink={referalLink} websiteUrl={myConstants.referral_url}/>
                    </div>
                    <div className="flex flex-col h-[140px]"></div>
                </div>
                
            )}
                
            
         
           
        </div>
    
);




};
export default TaskSection;