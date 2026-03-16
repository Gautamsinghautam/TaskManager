import React, { useState } from 'react'
import { FaList } from 'react-icons/fa'
import { MdGridView } from 'react-icons/md'
import { useParams } from 'react-router-dom';
import Loading from '../components/Loader';
import Title from '../components/Title';
import { Button, TabPanel } from '@headlessui/react';
import { IoMdAdd } from 'react-icons/io';
import Tabs from '../components/Tabs';
import TaskTitle from '../components/TaskTitle';
import BoardView from '../components/BoardView';
import { tasks } from '../assets/data';
import Table from '../components/task/Table';

const TABS= [
  {title: "Board View", icon: <MdGridView />},
  {title: "List View", icon: <FaList />}
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

function Tasks() {
  const params = useParams();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const status= params?.status || "";

  return loading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between gap-6 mt-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"}></Title>
        {!status && ( 
          <Button
              className="flex items-center gap-1 bg-blue-600 text-white rounded-md px-4 py-2 2xl:py-2.5"
            >
              <IoMdAdd className="text-lg" />
              Create Task
          </Button>
        )}
      </div>
      <div className="mt-4">
        {/* <Tabs tabs={TABS} setSelected={setSelected}> */}
          <Tabs tabs={TABS}>
  
              <TabPanel>
                  {!status && (
                    <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
                      <TaskTitle label="To Do" className={TASK_TYPE.todo} />
                      <TaskTitle label="In Progress" className={TASK_TYPE["in progress"]} />
                      <TaskTitle label="Completed" className={TASK_TYPE.completed} />
                    </div>
                  )}
                  <BoardView tasks={tasks} />
                </TabPanel>

                  <TabPanel>
                    <div className='w-full'>
                      <Table tasks={tasks} />
                    </div>
                  </TabPanel>

            </Tabs>
      </div>
    </div>
  )
}

export default Tasks
