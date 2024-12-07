import React, { useContext, useState, useEffect } from "react";
import { GameContext } from "../context/GameContext";
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

    const taskProgress = activeTask && taskStartFCount !== null
        ? Math.min(((fCount - taskStartFCount) / activeTask.target) * 100, 100)
        : 0;

    const handleStartTask = (task: Task) => {
        if (activeTask) {
            alert("Finish the current task before starting a new one!");
            return;
        }
        setActiveTask(task);
        setTaskStartFCount(fCount);
    };

    const completeTask = () => {
        if (!activeTask || taskStartFCount === null) return;

        const minedAmount = fCount - taskStartFCount;
        const reward = 2 * activeTask.target;

        setfCount((prev) => prev + reward);
        alert(`Task completed! You earned ${reward} F$ as a reward.`);

        setActiveTask(null);
        setTaskStartFCount(null);
    };

    useEffect(() => {
        if (activeTask && taskStartFCount !== null) {
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
            <div className="flex flex-col justify-center gap-7 items-center font-spicyrice bg-gray-800 px-6 py-10 rounded-xl shadow-lg w-screen sm:w-[500px] min-h-screen">
                <div className="text-4xl font-spicyrice text-goldenYellow uppercase">
                    Level {level}
                </div>
                <div className="text-4xl font-spicyrice text-goldenYellow">
                    Total F$: {fCount}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => toggleCategory("daily")}
                        className="px-4 py-2 bg-goldenYellow rounded"
                    >
                        Daily Tasks
                    </button>
                    <button
                        onClick={() => toggleCategory("weekly")}
                        className="px-4 py-2 bg-goldenYellow rounded"
                    >
                        Weekly Tasks
                    </button>
                    <button
                        onClick={() => toggleCategory("monthly")}
                        className="px-4 py-2 bg-goldenYellow rounded"
                    >
                        Monthly Tasks
                    </button>
                </div>

                {activeCategory && (
                    <div className="text-xl font-semibold text-white mt-4">
                        {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Tasks:
                        <ul>
                            {getTasksForCategory().map((task) => (
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

                <div>
                    <FooterMain />
                </div>
            </div>
        </div>
    );
};

export default TaskSection;
