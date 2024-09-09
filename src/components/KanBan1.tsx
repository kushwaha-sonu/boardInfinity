"use client";

import React, {useEffect, useState} from "react";
import {collection, getDocs, updateDoc, doc} from "firebase/firestore";
import db from "@/firebase/firebaseConfig";
import {Loader2} from "lucide-react";
import {DragDropContext, Droppable, Draggable, DropResult} from "react-beautiful-dnd";

type Task = {
    id: string;
    title: string;
    description: string;
    date: string;
    priority: "Low" | "Medium" | "High";
    status: "To Do" | "In Progress" | "Done";
};

const KanbanBoard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const taskCollection = collection(db, "tasks");
                const querySnapshot = await getDocs(taskCollection);

                const tasksArray: Task[] = [];
                querySnapshot.forEach((doc) => {
                    tasksArray.push({id: doc.id, ...doc.data()} as Task);
                });

                setTasks(tasksArray);
            } catch (error) {
                setError("Error fetching tasks: " + (error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Handle drag end
    const onDragEnd = async (result: DropResult) => {
        const {destination, source, draggableId} = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const sourceColumn = source.droppableId as "To Do" | "In Progress" | "Done";
        const destinationColumn = destination.droppableId as "To Do" | "In Progress" | "Done";

        const sourceTasks = tasks.filter((task) => task.status === sourceColumn);
        const [removedTask] = sourceTasks.splice(source.index, 1);

        if (sourceColumn === destinationColumn) {
            sourceTasks.splice(destination.index, 0, removedTask);
            setTasks(tasks.map((task) =>
                task.id === removedTask.id ? {...task, status: sourceColumn} : task
            ));
        } else {
            const destinationTasks = tasks.filter((task) => task.status === destinationColumn);
            destinationTasks.splice(destination.index, 0, removedTask);
            setTasks(tasks.map((task) =>
                task.id === removedTask.id ? {...task, status: destinationColumn} : task
            ));
        }

        try {
            await updateDoc(doc(db, "tasks", removedTask.id), {
                status: destinationColumn,
            });
        } catch (error) {
            console.error("Error updating task status: ", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center mt-8">
                <Loader2 className="animate-spin size-8"/> Loading...
            </div>
        );
    }

    if (error) {
        return <p>{error}</p>;
    }

    const columns = {
        "To Do": tasks.filter((task) => task.status === "To Do"),
        "In Progress": tasks.filter((task) => task.status === "In Progress"),
        "Done": tasks.filter((task) => task.status === "Done"),
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="container mx-auto flex gap-6 flex-col md:flex-row mt-11 p-4">
                {Object.entries(columns).map(([status, tasks]) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided) => (
                                <div
                                    className="kanban-column"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h2>{status}</h2>
                                    {tasks.map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    className="task"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    {task.title}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    )
                )}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
