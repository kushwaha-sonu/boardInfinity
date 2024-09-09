"use client";

import React from "react";
import SingleTask from "@/components/SingleTask";
import { cn } from "@/lib/utils";
import { Droppable, Draggable } from "react-beautiful-dnd";

type Task = {
    id: string;
    title: string;
    description: string;
    date: string;
    priority: "Low" | "Medium" | "High";
    status: "To Do" | "In Progress" | "Done";
};

type KanbanColumnProps = {
    title: string;
    tasks: Task[];
    droppableId: string;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tasks, droppableId }) => {
    return (
        <Droppable droppableId={droppableId}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`w-full bg-gray-200 rounded-lg overflow-hidden ${snapshot.isDraggingOver ? 'bg-gray-300' : ''}`}
                >
                    <h2
                        className={cn(
                            "text-center font-semibold text-2xl p-2",
                            {
                                "bg-purple-600 text-white": title === "To Do",
                                "bg-orange-400 text-white": title === "In Progress",
                                "bg-green-400 text-white": title === "Done",
                            }
                        )}
                    >
                        {title}
                    </h2>

                    {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex flex-col p-3 mb-2 "
                                >
                                    <SingleTask
                                        id={task.id}
                                        dueDate={task.date}
                                        status={task.status}
                                        title={task.title}
                                        priority={task.priority}
                                        description={task.description}
                                    />
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default KanbanColumn;
