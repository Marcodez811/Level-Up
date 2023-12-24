import Image from 'next/image'
import { AddUserButton, AddTask, DeleteTaskButton, CompleteTaskButton } from './_component/Tasks'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AddUserButton></AddUserButton>
      <AddTask></AddTask>
      {/* <DeleteTaskButton></DeleteTaskButton>
      <CompleteTaskButton></CompleteTaskButton> */}
    </main>
  )
}
