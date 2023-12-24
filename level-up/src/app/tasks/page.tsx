import Image from 'next/image';
import { AddUserButton, AddTask, DeleteTaskButton, CompleteTaskButton } from '../_component/Tasks';
import { getTasks } from '../_component/actions';
// import { auth } from "@/lib/auth";
export default async function TasksList() {
    // const session = await auth();
    // if (!session?.user?.id) return null;
    // const userName = session.user.username;
    const username = "test";
    const tasks = await getTasks(username);
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <AddTask />
        {tasks.map((task, i) => {
            return (
                <div className='flex gap-2' key={i}>
                    <div key={i} className="group flex w-full cursor-pointer items-center justify-between gap-2 text-slate-400 hover:bg-slate-600 ">
                        <div>
                        {task.name}
                        </div>
                        <div>
                        {task.content}
                        </div>
                        <div>
                        {task.time}
                        </div>
                        <div>
                        {task.difficulty}
                        </div>
                        <CompleteTaskButton taskId={task.displayId} />
                        <DeleteTaskButton taskId={task.displayId} />
                    </div>
                    
                </div>
              
              
            );
          })}
    </div>
  )
}