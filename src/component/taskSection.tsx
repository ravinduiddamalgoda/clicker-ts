import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import FooterMain from "./footerMain";
import { GlobalContextProps } from "../global";
import ReferralLinkShare from "./referralLinkShare";
import Day from '../assets/icons/day.png'
import Month from '../assets/icons/month.png'
import Week from '../assets/icons/week.png'

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
            alert("Finish the current task before starting a new one!");
            return;
        }

        if (!activeCategory) return;

        if (!isTaskRefreshable(task.id, activeCategory)) {
            alert(`You can only complete this task once per ${activeCategory}!`);
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
        alert(`Task completed! You earned ${reward} F$ as a reward.`);

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
            <div className="flex flex-col justify-between gap-7 font-roadrage py-4 items-center bg-gray-800 rounded-xl shadow-lg w-screen sm:w-[500px] min-h-screen sm:min-h-[calc(100vh-2rem)] sm:my-4 bg-gradient-to-t from-black to-transparent">
                <div className="flex flex-col gap-4">
                    <div className="text-5xl text-goldenYellow uppercase">
                        Level {level}
                    </div>
                    <div className="text-5xl text-goldenYellow">
                        Total F$: {fCount.toFixed(2)}
                    </div>
                </div>

                <div className="flex gap-4 font-roadrage text-lg text-white">
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

                {activeCategory && (
                    <div className="text-3xl text-white mt-4">
                        {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Tasks
                        <ul>
                            {getTasksForCategory().map((task) => (
                                <li key={task.id} className="mt-2">
                                    <button
                                        onClick={() => handleStartTask(task)}
                                        disabled={!!activeTask}
                                        className={`px-4 py-2 rounded font-thin w-[300px] tracking-widest ${activeTask?.id === task.id
                                            ? "bg-charcoalGray"
                                            : "bg-gradient-to-l from-card to-transparent"
                                            // : "bg-card"
                                            }`}
                                    >
                                        Mine {task.target} F$
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
                        <div className="bg-charcoalGray h-4 rounded-full shadow-glow w-4/5 mt-2">
                            <div
                                className="bg-magentaPurple h-full rounded-full transition-all duration-300"
                                style={{ width: `${taskProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    <div>
                        <div className="text-white text-3xl mb-2">Share Referrel</div>
                        <ReferralLinkShare referralLink="23456789iuygfcvbnm" websiteUrl="https://www.clickerts.com" />
                    </div>
                    <div>
                        <FooterMain />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskSection;
