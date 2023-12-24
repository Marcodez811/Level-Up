import Image from 'next/image'
import { AddUserButton, AddTaskButton, DeleteTaskButton, CompleteTaskButton } from './_component/Tasks'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button>Add Data</button>
      <AddUserButton></AddUserButton>
      <AddTaskButton></AddTaskButton>
      <DeleteTaskButton></DeleteTaskButton>
      CompleteTaskButtonompleteTaskButton
    </main>
  )
}
