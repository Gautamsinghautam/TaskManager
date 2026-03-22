import { Dialog, DialogTitle } from "@headlessui/react";
import React  from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import ModalWrapper from "./ModalWrapper";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";
import { toast } from "react-toastify";
import Textbox from "./Textbox";
import Loading from "./Loader";

const ChangePassword = ({ open, setOpen }) => {
    const { register, handleSubmit, formState: { errors ,}, reset } = useForm();
    const [changePassword, {isLoading}] = useChangePasswordMutation();
    const handleOnSubmit = async (data) => {
        if (data.password !== data.cpass){
            toast.warning("Password and confirm password do not match");
            return;
        }
        try {
            const res = await changePassword(data).unwrap();
            toast.success("Password changed successfully");
            reset();
            setTimeout(() => {
                setOpen(false);
            }, 1000);
        } catch (error) {
            toast.error(error?.data?.message || "Something went wrong");
        }
    };

    return (
        <>
          <ModalWrapper open={open} setOpen={setOpen}>
            <form onSubmit={handleSubmit(handleOnSubmit)} className='w-full max-w-md p-6 bg-white rounded-lg shadow-lg'>
                <DialogTitle
                    as="h2"
                    className={'text-base font-bold leading-6 text-gray-900 mb-4'}
                    >
                    Change Password
                    </DialogTitle>
                <Textbox
                    type="password"
                    name="oldPassword"
                    label="Old Password"
                    placeholder="Enter old password"
                    register={register("oldPassword", { required: "Old Password is required" })}
                    error={errors.oldPassword ? errors.oldPassword.message : ""}
                />
                <Textbox
                    type="password"
                    name="password"
                    label="New Password"
                    placeholder="Enter new password"
                    register={register("password", { required: "New Password is required" })}
                    error={errors.password ? errors.password.message : ""}
                />
                <Textbox
                    type="password"
                    name="cpass"
                    label="Confirm new Password"
                    placeholder="Confirm new password"
                    register={register("cpass", { required: "Confirm Password is required" })}
                    error={errors.cpass ? errors.cpass.message : ""}
                />
                {isLoading ? (
                    <div className='py-5'>
                        <Loading />
                    </div>
                ) : (
                    <div className="py-3 mt-4 sm:flex-row-reverse">
                        <Button type="submit" label="save" className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700" />
                        <Button
                            type="button"
                            className={"bg-white px-8 mt-3 text-sm font-semibold text-gray-900 sm:w-auto border border-gray-300 rounded-md hover:bg-gray-100"}
                            onClick={() => setOpen(false)}
                            >Cancel</Button>
                    </div>

                )
            }
                
            </form> 
                    </ModalWrapper>
        </>
    )


}

export default ChangePassword;