import React, { useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { summary } from "../assets/data";
import { getInitials } from "../utils";
import clsx from "clsx";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([...summary.users]);
  const [editUser, setEditUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Title</th>
        <th className='py-2'>Email</th>
        <th className='py-2'>Role</th>
        <th className='py-2'>Active</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='p-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700'>
            <span className='text-xs md:text-sm text-center'>
              {getInitials(user.name)}
            </span>
          </div>
          {user.name}
        </div>
      </td>

      <td className='p-2'>{user.title}</td>
      <td className='p-2'>{user.email || "user.emal.com"}</td>
      <td className='p-2'>{user.role}</td>

      <td>
        <button
          // onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            user?.isActive ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </button>
      </td>

      <td className='p-2 flex gap-4 justify-end'>
        <Button
          className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
          label='Edit'
          type='button'
          onClick={() => {
            setEditUser(user);
            setEditModalOpen(true);
          }}
        />

        <Button
          className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
          label='Delete'
          type='button'
          onClick={() => {
            if (window.confirm(`Delete user: ${user.name}?`)) {
              setUsers(users => users.filter(u => u._id !== user._id));
            }
          }}
        />
      </td>
    </tr>
  );

  return (
    <div className='w-full md:px-1 px-0 mb-6'>
      <div className='flex items-center justify-between mb-8'>
        <Title title='  Team Members' />
        <Button
          label='Add New User'
          icon={<IoMdAdd className='text-lg' />}
          className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5'
          onClick={() => setOpen(true)}
        />
      </div>

      <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded'>
        <div className='overflow-x-auto'>
          <table className='w-full mb-5'>
            <TableHeader />
            <tbody>
              {users.map((user, index) => (
                <TableRow key={index} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
          <div className='bg-white rounded shadow-lg p-6 w-full max-w-md'>
            <h2 className='text-lg font-bold mb-4'>Edit User</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                setUsers(users => users.map(u => u._id === editUser._id ? editUser : u));
                setEditModalOpen(false);
              }}
            >
              <div className='mb-3'>
                <label className='block text-sm mb-1'>Name</label>
                <input
                  className='w-full border px-2 py-1 rounded'
                  value={editUser.name}
                  onChange={e => setEditUser({ ...editUser, name: e.target.value })}
                  required
                />
              </div>
              <div className='mb-3'>
                <label className='block text-sm mb-1'>Title</label>
                <input
                  className='w-full border px-2 py-1 rounded'
                  value={editUser.title}
                  onChange={e => setEditUser({ ...editUser, title: e.target.value })}
                  required
                />
              </div>
              <div className='mb-3'>
                <label className='block text-sm mb-1'>Email</label>
                <input
                  className='w-full border px-2 py-1 rounded'
                  value={editUser.email}
                  onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                  required
                />
              </div>
              <div className='mb-3'>
                <label className='block text-sm mb-1'>Role</label>
                <input
                  className='w-full border px-2 py-1 rounded'
                  value={editUser.role}
                  onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                  required
                />
              </div>
              <div className='flex gap-2 justify-end'>
                <button
                  type='button'
                  className='px-4 py-2 rounded bg-gray-300 text-gray-700'
                  onClick={() => setEditModalOpen(false)}
                >Cancel</button>
                <button
                  type='submit'
                  className='px-4 py-2 rounded bg-blue-600 text-white'
                >Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;