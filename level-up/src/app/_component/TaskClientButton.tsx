"use client";

import { useRef, useState } from "react";
import { addTask } from "./actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddTaskClient() {
  const [taskName, setTaskName] = useState('');
  const [taskContent, setTaskContent] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskDifficulty, setTaskDifficulty] = useState(1);
  const taskNameRef = useRef<HTMLInputElement>(null);
  const taskContentRef = useRef<HTMLInputElement>(null);
  const taskTimeRef = useRef<HTMLInputElement>(null);
  const taskDifficultyRef = useRef<HTMLSelectElement>(null);

  const router = useRouter();
  async function clickHandler(e: React.FormEvent<HTMLFormElement>) {
    // const session = useSession();
    // const username = session.data?.user?.username;
    const username = "test"
    e.preventDefault();
    try {
        console.log(taskName, taskContent, taskTime);
        const result = await addTask(taskName, taskContent, username, taskTime, taskDifficulty);
    } catch (e) {
      const error = e as Error;
      alert(error.message);
      return;
    }
    if (taskNameRef.current && taskContentRef.current && taskTimeRef.current && taskDifficultyRef.current){
      taskNameRef.current.value = "";
      taskContentRef.current.value = "";
      taskTimeRef.current.value = "";
      taskDifficultyRef.current.value = "1";
      await (async() => {
        setTaskName("");
        setTaskContent("");
        setTaskTime("");
        setTaskDifficulty(1);
      })();
    }
    alert("Task is added!");
    console.log(taskNameRef.current && taskContentRef.current && taskTimeRef.current && taskDifficultyRef.current)
    
    router.refresh();

    // return;
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <form
            onSubmit={async (e) => {
              clickHandler(e);
            }}
            className="flex flex-row gap-4"
            id="task-add-form"
          >
            <input type="text" name="task-name" style={{color:"black"}} 
                value={taskName}
                ref={taskNameRef}
                onChange={(e) => {
                    setTaskName(e.target.value);
            }}/>
            <input type="text" name="task-content" style={{color:"black"}}
                value={taskContent}
                ref={taskContentRef}
                onChange={(e) => {
                    setTaskContent(e.target.value);
                }}
            />
            <input type="text" name="task-time" style={{color:"black"}}
                value={taskTime}
                ref={taskTimeRef}
                onChange={(e) => {
                    setTaskTime(e.target.value);
                }}
            />
            <select name="task-diffuculty" ref={taskDifficultyRef} style={{color:"black"}} onChange={(e) => {setTaskDifficulty(parseInt(e.target.value))}}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
            <button type="submit">Add Task</button>
          </form>
    </div>
  );
}