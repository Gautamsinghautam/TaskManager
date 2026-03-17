import React from 'react'
import TaskCard from './TaskCard'

const BoardView = ({tasks}) => {
  // Organize tasks by stage
  const todoTasks = tasks.filter(task => task.stage === 'todo');
  const inProgressTasks = tasks.filter(task => task.stage === 'in progress');
  const completedTasks = tasks.filter(task => task.stage === 'completed');

  const TaskColumn = ({ title, tasks, bgColor }) => (
    <div className='flex-1 bg-gray-50 rounded-lg p-4'>
      <div className={`text-white font-bold text-lg p-3 rounded mb-4 ${bgColor}`}>
        {title} ({tasks.length})
      </div>
      <div className='space-y-4 min-h-96 max-h-96 overflow-y-auto'>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <TaskCard task={task} key={index} />
          ))
        ) : (
          <div className='flex items-center justify-center h-full text-gray-400'>
            <p>No {title.toLowerCase()} tasks</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className='w-full py-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <TaskColumn 
          title='To Do' 
          tasks={todoTasks} 
          bgColor='bg-blue-600'
        />
        <TaskColumn 
          title='In Progress' 
          tasks={inProgressTasks} 
          bgColor='bg-yellow-600'
        />
        <TaskColumn 
          title='Completed' 
          tasks={completedTasks} 
          bgColor='bg-green-600'
        />
      </div>
    </div>
  )
}

export default BoardView