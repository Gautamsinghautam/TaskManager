import { useForm } from "react-hook-form";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";
import { toast } from "react-toastify";
import { useCreateSubTaskMutation } from "../../redux/slices/api/taskApiSlice";
import { useState } from "react";

const AddSubTask = ({ open, setOpen, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [addSbTask] = useCreateSubTaskMutation();

  const handleOnSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("Submitting sub-task with data:", { ...data, id });
      const res = await addSbTask({ ...data, id }).unwrap();
      console.log("Response:", res);
      toast.success(res.message || "Sub-task added successfully");
      reset();
      setOpen(false);
      setIsLoading(false);
    } catch (err) {
      console.error("Error adding sub-task:", err);
      console.error("Error status:", err?.status);
      console.error("Error data:", err?.data);
      console.error("Full error object:", JSON.stringify(err, null, 2));
      
      let errorMessage = "Failed to add sub-task";
      if (err?.status === 0) {
        errorMessage = "Cannot connect to server. Make sure the backend is running.";
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.error) {
        errorMessage = err.error;
      }
      
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            ADD SUB-TASK
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Sub-Task title'
              type='text'
              name='title'
              label='Title'
              className='w-full rounded'
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />

            <div className='flex items-center gap-4'>
              <Textbox
                placeholder='Date'
                type='date'
                name='date'
                label='Task Date'
                className='w-full rounded'
                register={register("date", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date.message : ""}
              />
              <Textbox
                placeholder='Tag'
                type='text'
                name='tag'
                label='Tag'
                className='w-full rounded'
                register={register("tag", {
                  required: "Tag is required!",
                })}
                error={errors.tag ? errors.tag.message : ""}
              />
            </div>
          </div>
          <div className='py-3 mt-4 flex sm:flex-row-reverse gap-4'>
            <Button
              type='submit'
              disabled={isLoading}
              className={`${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-sm font-semibold text-white sm:ml-3 sm:w-auto`}
              label={isLoading ? "Adding..." : "Add Task"}
            />

            <Button
              type='button'
              disabled={isLoading}
              className={`${
                isLoading 
                  ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                  : 'bg-white border border-gray-300'
              } text-sm font-semibold text-gray-900 sm:w-auto`}
              onClick={() => setOpen(false)}
              label='Cancel'
            />
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddSubTask;  