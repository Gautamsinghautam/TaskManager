import React, { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '../utils';
import { FaUser, FaUserLock } from 'react-icons/fa';
import { IoLogOutOutline } from "react-icons/io5";

function UserAvatar() {
    const [open, setOpen] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);
    const { user } =useSelector((state) => state.auth);
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const logoutHandler = () => {
        console.log("logout");
    }
  return ( 
    <div>
        <Menu as="div" className= "relative inline-block text-left">
            <div>
                <MenuButton className="w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-blue-600">
                    <span className='text-white font-semibold'>
                        {getInitials(user?.name)}
                    </span>
                </MenuButton>
            </div>
                
            <MenuItems 
             transition
             className="absolute right-0 mt-2 w-56 origin-top-right divide-amber-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
            <div className='p-4'>
                <MenuItem>
                    {({focus}) => (    
                        <button onClick={() => setOpen(true)}
                        className={`text-gray-700 group flex w-full items-center rounded-md px-2 ${focus ? "bg-gray-100" : "" } `}
                        >
                         <FaUser className='mr-2' aria-hidden="true" />
                         Profile
                        </button>
                    )}
                </MenuItem>
                <MenuItem>
                    {({focus}) => (
                        <button onClick={ () =>setOpenPassword(true)}
                        className={`text-gray-700 group flex w-full
                            items-center rounded-md px-2 py-2 text-base ${focus ? "bg-gray-100" : ""}`}
                        >
                            <FaUserLock className='mr-2' aria-hidden="true" />
                            Change Password
                        </button>
                    )}
                </MenuItem>
                <MenuItem>
                {({focus}) => (
                    <button onClick={logoutHandler}
                    className={`text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base ${focus ? "bg-gray-100": ""}`}>
                        <IoLogOutOutline className='mr-2' aria-hidden='true' />
                        Logout
                    </button>
                )}
                </MenuItem>
            </div>

            </MenuItems>


        </Menu>
    </div>
  )
}

export default UserAvatar