import { PRIORITYSTYLES, TASK_TYPE } from "../utils";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import Title from "../components/Title";
import Button from "../components/Button";
import ConfirmatioDialog from "../components/Dialogs";
import { useGetAllTasksQuery, useDeleteRestoreTaskMutation } from "../redux/slices/api/taskApiSlice";
import { toast } from "react-toastify";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");
  const [trashTasks, setTrashTasks] = useState([]);

  // Fetch trashed tasks from API
  const { data: response, isLoading, refetch } = useGetAllTasksQuery({
    istrashed: "true",
  });

  const [deleteRestoreTask] = useDeleteRestoreTaskMutation();

  // Update local state when API data changes
  useEffect(() => {
    if (response?.tasks) {
      console.log("Trash tasks fetched:", response.tasks);
      setTrashTasks(response.tasks);
    }
  }, [response]);

  const deleteAllClick = () => {
    console.log('Delete All Clicked');
    setType("deleteAll");
    setMsg("Do you want to permanently delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    console.log('Restore All Clicked');
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    console.log('Delete Clicked', id);
    setType("delete");
    setSelected(id);
    setMsg("Do you want to delete this item?");
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    console.log('Restore Clicked', id);
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };

  const deleteRestoreHandler = async () => {
    console.log('Dialog Confirmed', type, selected);
    try {
      if (type === "deleteAll") {
        // For deleteAll, use a dummy ID since the backend ignores it for bulk operations
        await deleteRestoreTask({
          id: "bulk",
          actionType: "deleteAll",
        }).unwrap();
        setTrashTasks([]);
        toast.success("All items deleted permanently");
      } else if (type === "restoreAll") {
        // For restoreAll, use a dummy ID since the backend ignores it for bulk operations
        await deleteRestoreTask({
          id: "bulk",
          actionType: "restoreAll",
        }).unwrap();
        setTrashTasks([]);
        toast.success("All items restored successfully");
      } else if (type === "delete") {
        await deleteRestoreTask({
          id: selected,
          actionType: "delete",
        }).unwrap();
        setTrashTasks(tasks => tasks.filter(t => t._id !== selected));
        toast.success("Item deleted permanently");
      } else if (type === "restore") {
        await deleteRestoreTask({
          id: selected,
          actionType: "restore",
        }).unwrap();
        setTrashTasks(tasks => tasks.filter(t => t._id !== selected));
        toast.success("Item restored successfully");
      }
      setOpenDialog(false);
      setSelected("");
      setType("delete");
      setMsg(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black  text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Stage</th>
        <th className='py-2 line-clamp-1'>Modified On</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])}
          />
          <p className='w-full line-clamp-2 text-base text-black'>
            {item?.title}
          </p>
        </div>
      </td>

      <td className='py-2 capitalize'>
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIORITYSTYLES[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span className=''>{item?.priority}</span>
        </div>
      </td>

      <td className='py-2 capitalize text-center md:text-start'>
        {item?.stage}
      </td>
      <td className='py-2 text-sm'>{new Date(item?.date).toDateString()}</td>

      <td className='py-2 flex gap-1 justify-end'>
        <Button
          icon={<MdOutlineRestore className='text-xl text-gray-500' />}
          onClick={() => restoreClick(item._id)}
        />
        <Button
          icon={<MdDelete className='text-xl text-red-600' />}
          onClick={() => deleteClick(item._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Trashed Tasks' />

          <div className='flex gap-2 md:gap-4 items-center'>
            <Button
              label='Restore All'
              icon={<MdOutlineRestore className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center  text-black text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={() => restoreAllClick()}
              disabled={trashTasks?.length === 0}
            />
            <Button
              label='Delete All'
              icon={<MdDelete className='text-lg hidden md:flex' />}
              className='flex flex-row-reverse gap-1 items-center  text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5'
              onClick={() => deleteAllClick()}
              disabled={trashTasks?.length === 0}
            />
          </div>
        </div>
        <div className='bg-white px-2 md:px-6 py-4 shadow-md rounded'>
          {isLoading ? (
            <div className='text-center py-8'>
              <p className='text-gray-500'>Loading trash items...</p>
            </div>
          ) : trashTasks?.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-gray-500'>No trashed items</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full mb-5'>
                <TableHeader />
                <tbody>
                  {trashTasks?.map((tk, id) => (
                    <TableRow key={id} item={tk} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        type={type}
        setType={setType}
        onClick={deleteRestoreHandler}
      />
    </>
  );
};

export default Trash;