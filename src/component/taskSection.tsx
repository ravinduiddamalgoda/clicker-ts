import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import FooterMain from "./footerMain";
import { GlobalContextProps } from "../global";
import ReferralLinkShare from "./referralLinkShare";
import Day from '../assets/icons/day.png';
import Month from '../assets/icons/month.png';
import Week from '../assets/icons/week.png';
import NameLogo from '../assets/icons/minenwin.jpg';
import {NumberWithCommas} from "./hookFunctions";

const dailyTasks = [
    { id: 1, target: 1000 },
    { id: 2, target: 5000 },
    { id: 3, target: 10000 },
    { id: 4, target: 25000 },
    { id: 5, target: 50000 },
    { id: 6, target: 100000 },
];

const weeklyTasks = [
    { id: 1, target: 100000 },
    { id: 2, target: 250000 },
    { id: 3, target: 500000 },
    { id: 4, target: 1000000 },
];

const monthlyTasks = [
    { id: 1, target: 1000000 },
    { id: 2, target: 2500000 },
    { id: 3, target: 5000000 },
    { id: 4, target: 10000000 },
];

interface Task {
    id: number;
    target: number;
}

const TaskSection: React.FC = () => {
    const { level, fCount, setfCount } = useContext(GameContext) as GlobalContextProps;
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [taskStartFCount, setTaskStartFCount] = useState<number | null>(null);
    const [taskStartTime, setTaskStartTime] = useState<number | null>(null);
    const [completedTasks, setCompletedTasks] = useState<Record<string, number>>({});
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState<string | null>(null);


    const taskProgress = activeTask && taskStartFCount !== null
        ? Math.min(((fCount - taskStartFCount) / activeTask.target) * 100, 100)
        : 0;

    const getStartOfDay = () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    };

    const getStartOfWeek = () => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek).getTime();
        return startOfWeek;
    };

    const getStartOfMonth = () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    };

    const getStartOfCurrentPeriod = (category: string) => {
        switch (category) {
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

    const isTaskRefreshable = (taskId: number, category: string) => {
        const taskKey = `${category}-${taskId}`;
        const lastCompletionTime = completedTasks[taskKey];
        const startOfPeriod = getStartOfCurrentPeriod(category);

        if (!lastCompletionTime || lastCompletionTime < startOfPeriod) {
            return true;
        }
        return false;
    };

    const handleStartTask = (task: Task) => {
        if (activeTask) {
            alert( "Finish the current task before starting a new one!");
            setMessage(pre=> pre = "Finish the current task before starting a new one!");
            setShowMessage(true);
            return;
        }

        if (!activeCategory) return;

        if (!isTaskRefreshable(task.id, activeCategory)) {
            //Message = `You can only complete this task once per ${activeCategory}!`;
            setMessage(pre => pre = `You can only complete this task once per ${activeCategory}!`);
            setShowMessage(true);
            return;
        }

        setActiveTask(task);
        setTaskStartFCount(fCount);
        setTaskStartTime(Date.now());
    };

    const completeTask = () => {
        if (!activeTask || taskStartFCount === null || taskStartTime === null) return;

        const minedAmount = fCount - taskStartFCount;
        const reward = 2 * activeTask.target;

        setfCount((prev) => prev + reward);
       
        setMessage(pre => pre = `Task completed! You earned ${reward} F$ as a reward.`);
        setShowMessage(true);

        const currentCategory = activeCategory || "";
        setCompletedTasks((prev) => ({
            ...prev,
            [`${currentCategory}-${activeTask.id}`]: Date.now(),
        }));

        setActiveTask(null);
        setTaskStartFCount(null);
        setTaskStartTime(null);
    };

    useEffect(() => {
        if (activeTask && taskStartFCount !== null && taskStartTime !== null) {
            const minedAmount = fCount - taskStartFCount;
            if (minedAmount >= activeTask.target) {
                completeTask();
            }
        }
    }, [fCount]);

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
    };

    return (
        <div className="flex flex-col items-center justify-center text-center">
            {showMessage && (
             <div className="absolute inset-0 z-50 bg-black bg-opacity-95 text-white flex items-center justify-center p-2">
                <div className="w-full rounded w-[400px] p-2 bg-blue-700 text-center max-w-4xl font-roadrage font-extralight">
                    <div >
                            <div className=" flex flex-row rounded bg-blue-700 w-[370px] p-5 ">                        
                                <div className="text-xl mb-6 space-y-4 tracking-wider">{message}</div>
                        
                                <button
                                    className="bg-white text-black py-2 px-6 rounded-sm"
                                    onClick={() => setShowMessage(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                </div>
            </div>
             )}
           
            <div className="flex flex-col justify-between  font-roadrage py-4 items-center bg-gray-800 rounded-xl shadow-lg max-h-[600px] w-screen sm:w-[400px] min-h-screen sm:min-h-[calc(100vh-2rem)] sm:my-4 bg-gradient-to-t from-black to-transparent">
            
                <div className="flex flex-row gap-8 w-full justify-between">
                    <div className="flex pl-2">
                        <div className="text-2xl text-goldenYellow ">
                        <img src={NameLogo} alt="Name_logo"  width={50}/>
                        </div>          
                    </div>
                    <div className="flex pr-2">
                        <div className= "w-1/2">                           
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-row mt-5 justify-center w-full">
                    <div className="text-3xl text-goldenYellow">
                         F$: {fCount/*toFixed(2)*/}
                    </div>
                </div>

                <div className="flex gap-4 font-roadrage text-lg text-white pl-2 pr-2 mt-10">
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

                {activeCategory && (
                    <div className="text-xl text-white mt-5">
                        {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Tasks
                        <ul>
                            {getTasksForCategory().map((task) => (
                                <li key={task.id} className="mt-2">
                                    <button
                                        onClick={() => handleStartTask(task)}
                                        disabled={!!activeTask}
                                        className={`rounded font-thin w-[300px] border border-blue-500 tracking-widest ${activeTask?.id === task.id
                                            ? "bg-charcoalGray"
                                            : "bg-gradient-to-l from-card to-transparent"
                                            // : "bg-card"
                                            }`}
                                    >
                                        Mine {NumberWithCommas(task.target)} F$
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeTask && (
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
                )}
                
                   
                {activeCategory ? null : (  
                    <div className="flex flex-col gap-4 mt-20">          
                        <div>
                            <div className="text-white text-3xl mb-2">Share Referrel</div>
                            <ReferralLinkShare referralLink="23456789iuygfcvbnm" websiteUrl="https://www.clickerts.com" />
                        </div>
                    </div>
                    
                )}
                               
                <div className="flex-none w-full items-center p-2 bottom-0 ">                
                    <FooterMain />   
                </div>
               
            </div>
        </div>
    );
};

export default TaskSection;
