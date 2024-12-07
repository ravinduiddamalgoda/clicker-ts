import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import { levelIcons, levelMax } from "../constants/leveldata";
import FooterMain from "./footerMain";
import { GlobalContextProps } from "../global";

const dailyTasks = [
    { id: 1, target: 1000 },
    { id: 2, target: 5000 },
    { id: 3, target: 10000 },
    { id: 4, target: 25000 },
    { id: 5, target: 50000 },
    { id: 6, target: 100000 },
];

const weeklyTasks = [
    { id: 7, target: 100000 },
    { id: 8, target: 250000 },
    { id: 9, target: 500000 },
    { id: 10, target: 1000000 },
];

const monthlyTasks = [
    { id: 11, target: 1000000 },
    { id: 12, target: 2500000 },
    { id: 13, target: 5000000 },
    { id: 14, target: 10000000 },
];

interface Task {
    id: number;
    target: number;
}

const TaskSection: React.FC = () => {
    const { level, fCount, setfCount } = useContext(GameContext) as GlobalContextProps;
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [taskStartTime, setTaskStartTime] = useState<number | null>(null);
    const [taskStartFCount, setTaskStartFCount] = useState<number | null>(null);

    const taskProgress = activeTask && taskStartFCount !== null
        ? Math.min(((fCount - taskStartFCount) / activeTask.target) * 100, 100)
        : 0;

    const getRewardMultiplier = (taskId: number) => {
        if (weeklyTasks.some((task) => task.id === taskId)) return 2;
        if (monthlyTasks.some((task) => task.id === taskId)) return 3;
        return 1;
    };

    const handleStartTask = (task: Task) => {
        if (activeTask) {
            alert("Finish the current task before starting a new one!");
            return;
        }
        setActiveTask(task);
        setTaskStartTime(Date.now());
        setTaskStartFCount(fCount);
    };

    const completeTask = () => {
        if (!activeTask || taskStartFCount === null) return;

        const minedAmount = fCount - taskStartFCount;
        if (minedAmount >= activeTask.target) {
            const rewardMultiplier = getRewardMultiplier(activeTask.id);
            const reward = rewardMultiplier * activeTask.target;
    
            setfCount((prev) => prev + reward);
            alert(`Task completed! You earned ${reward} F$ as a reward.`);
    
            setActiveTask(null);
            setTaskStartTime(null);
            setTaskStartFCount(null);
        }
    };

    useEffect(() => {
        if (activeTask && taskStartFCount !== null) {
            const minedAmount = fCount - taskStartFCount;
            if (minedAmount >= activeTask.target) {
                completeTask();
            }
        }
    }, [fCount]);

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="flex flex-col justify-center gap-7 items-center font-spicyrice bg-gray-800 px-6 py-10 rounded-xl shadow-lg w-screen sm:w-[500px] min-h-screen">
                <div className="text-4xl font-spicyrice text-goldenYellow uppercase">
                    Level {level}
                </div>
                <button onClick={() => setfCount((prev) => prev + 10)}>
                    <img
                        src={levelIcons[level - 1]}
                        alt="Game Icon"
                        className="h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-gray-700 p-1 shadow-glow"
                    />
                </button>
                <div className="text-4xl font-spicyrice text-goldenYellow">
                    Total F$: {fCount}
                </div>
                {activeTask && (
                    <div className="text-white mt-4 flex justify-center items-center gap-4">
                        <div>
                            Task Progress: {fCount - (taskStartFCount || 0)} / {activeTask.target}
                        </div>
                    </div>
                )}
                {activeTask && (
                    <div className="bg-charcoalGray h-4 rounded-full shadow-glow w-4/5 mt-2">
                        <div
                            className="bg-magentaPurple h-full rounded-full transition-all duration-300"
                            style={{ width: `${taskProgress}%` }}
                        ></div>
                    </div>
                )}
                <div className="text-xl font-semibold text-white">
                    Daily Tasks:
                    <ul>
                        {dailyTasks.map((task) => (
                            <li key={task.id} className="mt-2">
                                <button
                                    onClick={() => handleStartTask(task)}
                                    disabled={!!activeTask}
                                    className={`px-4 py-2 rounded w-[300px] tracking-widest ${activeTask?.id === task.id
                                        ? "bg-charcoalGray"
                                        : "bg-goldenYellow"
                                        }`}
                                    style={{
                                        textShadow: "1px 1px 2px black",
                                    }}
                                >
                                    Mine {task.target} F$
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="text-xl font-semibold text-white mt-4">
                    Weekly Tasks:
                    <ul>
                        {weeklyTasks.map((task) => (
                            <li key={task.id} className="mt-2">
                                <button
                                    onClick={() => handleStartTask(task)}
                                    disabled={!!activeTask}
                                    className={`px-4 py-2 rounded w-[300px] tracking-widest ${activeTask?.id === task.id
                                        ? "bg-charcoalGray"
                                        : "bg-royalBlue"
                                        }`}
                                    style={{
                                        textShadow: "1px 1px 2px black",
                                    }}
                                >
                                    Mine {task.target} F$
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="text-xl font-semibold text-white mt-4">
                    Monthly Tasks:
                    <ul>
                        {monthlyTasks.map((task) => (
                            <li key={task.id} className="mt-2">
                                <button
                                    onClick={() => handleStartTask(task)}
                                    disabled={!!activeTask}
                                    className={`px-4 py-2 rounded w-[300px] tracking-widest ${activeTask?.id === task.id
                                        ? "bg-charcoalGray"
                                        : "bg-vividGreen"
                                        }`}
                                    style={{
                                        textShadow: "1px 1px 2px black",
                                    }}
                                >
                                    Mine {task.target} F$
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <FooterMain />
            </div>
        </div>
    );
};

export default TaskSection;
