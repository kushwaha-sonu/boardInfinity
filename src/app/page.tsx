
import Header from "@/components/Header";

import KanbanBoard from "@/components/KanbanBoard";
import {Toaster} from "@/components/ui/toaster";




export default function Home() {
  return (
    <div className='mb-8' >
        <Toaster />
     <Header/>
        <KanbanBoard/>


    </div>
  );
}
