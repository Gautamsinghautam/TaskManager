import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "./ModalWrapper";
import { DialogTitle } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { toast } from "react-toastify";
import { useCreateUserMutation, useUpdateUserMutation } from "../redux/slices/api/userApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";

const AddUser = ({ open, setOpen, userData, onUserAdded }) => {
  let defaultValues = userData ?? { name: "", title: "", email: "", role: "", password: "" };
  
  const dispatch = useDispatch();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  useEffect(() => {
    if (open) {
      reset(userData ?? { name: "", title: "", email: "", role: "", password: "" });
    }
  }, [open, userData, reset]);

  const handleOnSubmit = async (data) => {
    try {
      if (userData?._id) {
        // Update existing user (own profile)
        const result = await updateUser(data).unwrap();
        toast.success("Profile updated successfully");
        
        // Update Redux store with new user data
        if (result.user) {
          dispatch(setCredentials(result.user));
        }
      } else {
        // Create new user
        if (!data.password) {
          toast.error("Password is required for new users");
          return;
        }
        await createUser(data).unwrap();
        toast.success("User created successfully");
      }
      setOpen(false);
      onUserAdded?.();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save user");
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
          <DialogTitle
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </DialogTitle>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Full name'
              type='text'
              name='name'
              label='Full Name'
              className='w-full rounded'
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder='Title'
              type='text'
              name='title'
              label='Title'
              className='w-full rounded'
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox
              placeholder='Email Address'
              type='email'
              name='email'
              label='Email Address'
              className='w-full rounded'
              disabled={userData ? true : false}
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />

            <Textbox
              placeholder='Role'
              type='text'
              name='role'
              label='Role'
              className='w-full rounded'
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />

            {!userData && (
              <Textbox
                placeholder='Password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded'
                register={register("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters!",
                  },
                })}
                error={errors.password ? errors.password.message : ""}
              />
            )}
          </div>

          {isLoading || isUpdating ? (
            <div className='py-5'>
              <Loading />
            </div>
          ) : (
            <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                label='Submit'
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;