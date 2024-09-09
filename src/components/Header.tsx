"use client";

import {Button} from "@/components/ui/button";

import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import CreateForm from "@/components/CreateForm";
import {useState} from "react";


const Header = () => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className='container mx-auto mt-6 pt-10'>
            <div className='max-w-3xl mx-auto flex items-center justify-between bg-white rounded-md p-3'>
                <h1 className='text-rose-600 p-3 text-3xl font-bold'>Kanban Board</h1>
                <div className=''>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size='lg' className='text-2xl py-6 font-semibold'>Create</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create A Task </DialogTitle>
                                <DialogDescription>
                                    Enter the task details below to create a new task.
                                </DialogDescription>
                            </DialogHeader>
                          <CreateForm onClose={handleDialogClose}/>
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Header;