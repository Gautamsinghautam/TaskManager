import { Dialog, DialogTitle } from "@headlessui/react"
import Button from "./Button"
import ModalWrapper from "./ModalWrapper"


const ViewNotification = ({open, setOpen, el}) => {
    return (
        <>
        <ModalWrapper open={open} setOpen={setOpen}>
            <div className='py-4 w-full flex flex-col gap-4 items-center justify-center'>
                <DialogTitle as="h3" className='font-semibold text-lg capitalize'>
            {el?.notiType || "Notification"}
            </DialogTitle>
            <p className='text-start text-gray-500'>
                {el?.text}
            </p>
            <Button
            type="button"
            label="okay"
            className='bg-white px-8 mt-3 text-sm font-semibold text-gray-900 sm:w-auto border border-gray-300 rounded-md hover:bg-gray-100'
            onClick={() => setOpen(false)}
            ></Button>
            </div>
        </ModalWrapper>
        </>

    )
}

export default ViewNotification;