"use client";

import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Calendar} from "lucide-react";
import {cn} from "@/lib/utils";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {doc, updateDoc} from "@firebase/firestore";
import db from "@/firebase/firebaseConfig";
import {useToast} from "@/hooks/use-toast";




// @ts-ignore

const SingleTask = ({id,title,description,dueDate,priority,status}) => {

    const { toast } = useToast()



    function convertDate(dateString: string): string {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    }


    const handlePriorityChange = async (value: string) => {

        try {
            const taskDoc = doc(db, "tasks", id);
            console.log(`Priority for task ${id} updated to ${value}.`);
            await updateDoc(taskDoc, { priority: value });
            toast({
                title: "Priority updated",
                description: `Priority for task ${title} updated to ${value}.`,

            });



        }catch (error) {
            console.error("Error updating task priority: ", error);
            toast({

                title: "Error updating priority",
                variant: "destructive"

            });
        }


    }





    return (
        <Card className={cn(
            "max-w-md mx-auto w-full border-0 ",
            {"border-4 border-l-purple-500": status === "To Do"},
            {"border-4 border-l-orange-500": status === "In Progress"},
            {"border-4 border-l-green-500": status === "Done"},
        )}>
            <CardHeader className='border-l-purple-500'>
                <p className={cn(
                    "w-fit px-3",
                    {"bg-red-200 text-red-800 rounded-md": priority === "High"},
                    {"bg-yellow-300 text-yellow-800 rounded-md": priority === "Medium"},
                    {"bg-green-200 text-green-800 rounded-md": priority === "Low"},
                )}>{priority}</p>

                <div className='flex justify-between items-center'>
                <CardTitle>{title}</CardTitle>

                    <div>
                        <Select onValueChange={handlePriorityChange}>
                            <SelectTrigger >

                                <SelectValue placeholder="Change priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardFooter>
                <div className='flex items-center gap-1'>
                    <Calendar/>
                <p>{convertDate(dueDate)}</p>
                </div>
            </CardFooter>
        </Card>
    );



}

export default SingleTask;