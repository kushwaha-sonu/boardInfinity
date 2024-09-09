"use client";

import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "@/components/ui/textarea";
import {addDoc, collection} from "@firebase/firestore";
import db from "@/firebase/firebaseConfig";
import {toast} from "@/hooks/use-toast";







// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const CreateForm = ({onClose}) => {
    const formSchema = z.object({
        title: z.string().min(4, { message: "Title is required." }),
        description: z.string().min(10, { message: "Description is required." }),
        date: z.string().min(1, { message: "Date is required." }),
        priority: z.enum(["Low", "Medium", "High"], { message: "Priority is required." }),
        status: z.enum(["To Do", "In Progress", "Done"], { message: "Status is required." }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            date: "",
            priority: undefined,  // Removed default value
            status: undefined,    // Removed default value
        },
    });



    async function  onSubmit(values: z.infer<typeof formSchema>) {
        try {

            const taskCollection = collection(db, "tasks");
            const task=await addDoc(taskCollection,{
                title: values.title,
                description: values.description,
                date: values.date,
                priority: values.priority,
                status: values.status,
            });
            form.reset();
            toast({
                title: "Task created",
                description: "Task has been created successfully.",
            })
            onClose();



            console.log("Document written with ID: ", task);
        }catch (error) {
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className='flex items-start flex-col'>
                            <FormLabel className='text-black font-semibold'>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className='flex items-start flex-col'>
                            <FormLabel className='text-black font-semibold'>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className='flex items-start flex-col'>
                            <FormLabel className='text-black font-semibold'>Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem className='flex items-start flex-col'>
                            <FormLabel className='text-black font-semibold'>Priority</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className='flex items-start flex-col'>
                            <FormLabel className='text-black font-semibold'>Status</FormLabel>
                            <FormControl className='w-full'>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="To Do">To Do</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className='w-full' disabled={form.formState.isSubmitting} type="submit">Submit</Button>
            </form>
        </Form>
    );
};

export default CreateForm;
