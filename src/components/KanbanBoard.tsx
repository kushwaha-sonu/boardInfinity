"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import db from "@/firebase/firebaseConfig";
import KanbanColumn from "@/components/KanbanColumn";
import { Loader2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

type Task = {
    id: string;
    title: string;
    description: string;
    date: string;
    priority: "Low" | "Medium" | "High";
    status: "To Do" | "In Progress" | "Done";
};

type Status = "To Do" | "In Progress" | "Done";

const KanbanBoard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const taskCollection = collection(db, "tasks");
                const querySnapshot = await getDocs(taskCollection);

                const tasksArray: Task[] = [];
                querySnapshot.forEach((doc) => {
                    tasksArray.push({ id: doc.id, ...doc.data() } as Task);
                });

                setTasks(tasksArray);
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [tasks]); // Removed `tasks` from dependency array

    if (loading) {
        return (
            <div className="flex items-center justify-center mt-8">
                <Loader2 className="animate-spin size-8" /> Loading...
            </div>
        );
    }

    const getTasksByStatus = (status: Status) => tasks.filter((task) => task.status === status);

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

        const sourceTasks = getTasksByStatus(source.droppableId as Status);
        const destinationTasks = getTasksByStatus(destination.droppableId as Status);

        const movedTask = sourceTasks.find(task => task.id === draggableId);
        if (!movedTask) return;

        // Update task status
        movedTask.status = destination.droppableId as Status;

        // Update state
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.filter(task => task.id !== draggableId);
            return [...updatedTasks, movedTask];
        });

        // Update task in Firebase
        try {
            const taskDoc = doc(db, "tasks", draggableId);
            await updateDoc(taskDoc, { status: movedTask.status });
        } catch (error) {
            console.error("Error updating task status: ", error);
        }
    };

    return (
        <div className="container mx-auto flex gap-6 flex-col md:flex-row mt-11 p-4">
            <DragDropContext onDragEnd={handleDragEnd}>
                {["To Do", "In Progress", "Done"].map(status => (
                    <Droppable key={status} droppableId={status}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="w-full"
                            >
                                <KanbanColumn title={status} tasks={getTasksByStatus(status as Status)} droppableId={status} />
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
