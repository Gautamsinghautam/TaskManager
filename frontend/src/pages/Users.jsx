import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { summary } from "../assets/data";
import { getInitials } from "../utils";
import clsx from "clsx";
import AddUser from "../components/AddUser";
import ConfirmatioDialog from "../components/Dialogs";
import { useGetTeamListQuery, useDeleteUserMutation, useUserActionMutation } from "../redux/slices/api/userApiSlice";
import Loading from "../components/Loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Users = () => {
  // Get current user to check admin status
  const { user: currentUser } = useSelector((state) => state.auth);
  const isAdmin = currentUser?.isAdmin || false;

  // Modal states - consolidated
  const [modals, setModals] = useState({
    delete: false,
    action: false,
    edit: false,
    add: false
  });
  
  const [selected, setSelected] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [users, setUsers] = useState([]);

  // API hooks
  const { data: teamData, isLoading, refetch } = useGetTeamListQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [userAction, { isLoading: isUpdating }] = useUserActionMutation();

  // Generic handler for API operations with confirmation
  const handleAPIOperation = async (operation, operationName, successMsg, onSuccess) => {
    try {
      await operation().unwrap();
      toast.success(successMsg);
      refetch();
      onSuccess?.();
    } catch (error) {
      toast.error(error?.data?.message || `Failed to ${operationName}`);
    }
  };

  // User Action Handler (Activate/Deactivate)
  const userActionHandler = async () => {
    await handleAPIOperation(
      () => userAction({ isActive: !selected?.isActive, id: selected?._id }),
      selected?.isActive ? 'disable' : 'activate',
      `User ${selected?.isActive ? 'disabled' : 'activated'} successfully`,
      () => {
        setModals(prev => ({ ...prev, action: false }));
        setSelected(null);
      }
    );
  };

  // Delete Handler
  const deleteUserHandler = async () => {
    await handleAPIOperation(
      () => deleteUser(selected._id),
      'delete',
      'User deleted successfully',
      () => {
        setModals(prev => ({ ...prev, delete: false }));
        setSelected(null);
      }
    );
  };

  // Click handlers
  const openDeleteDialog = (userId) => {
    setSelected(users.find(u => u._id === userId));
    setModals(prev => ({ ...prev, delete: true }));
  };

  const openEditDialog = (user) => {
    setEditUser({ ...user });
    setModals(prev => ({ ...prev, edit: true }));
  };

  const openActionDialog = (user) => {
    setSelected(user);
    setModals(prev => ({ ...prev, action: true }));
  };

  const openAddDialog = () => {
    setModals(prev => ({ ...prev, add: true }));
  };

  // Update users when teamData changes - Merge DB data with mock data
  useEffect(() => {
    if (!isLoading) {
      // Start with DB users
      let mergedUsers = [];
      
      if (teamData && Array.isArray(teamData)) {
        mergedUsers = [...teamData];
      } else if (teamData && teamData.status === false) {
        // API returned an error, use mock data
        console.log("API error, using mock data");
      }
      
      // Add mock users that are not in the DB
      if (summary?.users && Array.isArray(summary.users)) {
        const dbUserIds = new Set(mergedUsers.map(u => u._id));
        const mockUsersNotInDb = summary.users.filter(
          mockUser => !dbUserIds.has(mockUser._id)
        );
        
        // Enrich mock users with email field if missing
        const enrichedMockUsers = mockUsersNotInDb.map(user => ({
          ...user,
          email: user.email || `${user.name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
          isActive: user.isActive !== undefined ? user.isActive : true
        }));
        
        mergedUsers = [...mergedUsers, ...enrichedMockUsers];
      }
      
      // If no API data and no enrichment, use all mock users
      if (mergedUsers.length === 0 && summary?.users) {
        mergedUsers = summary.users.map(user => ({
          ...user,
          email: user.email || `${user.name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
          isActive: user.isActive !== undefined ? user.isActive : true
        }));
      }
      
      setUsers(mergedUsers);
    }
  }, [teamData, isLoading]);

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

      <td className='p-2'>{user.title || "N/A"}</td>
      <td className='p-2'>{user.email || "user@email.com"}</td>
      <td className='p-2'>{user.role || "N/A"}</td>

      <td>
        <button
          onClick={() => openActionDialog(user)}
          disabled={!isAdmin}
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            !isAdmin && "opacity-50 cursor-not-allowed",
            user?.isActive ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </button>
      </td>

      <td className='p-2 flex gap-4 justify-end'>
        {isAdmin && (
          <>
            <Button
              className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
              label='Edit'
              type='button'
              onClick={() => openEditDialog(user)}
            />

            <Button
              className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
              label='Delete'
              type='button'
              onClick={() => openDeleteDialog(user._id)}
            />
          </>
        )}
      </td>
    </tr>
  );

  return (
    <div className='w-full md:px-1 px-0 mb-6'>
      <div className='flex items-center justify-between mb-8'>
        <Title title='  Team Members' />
        {isAdmin && (
          <Button
            label='Add New User'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5'
            onClick={openAddDialog}
          />
        )}
      </div>

      {isLoading ? (
        <div className='py-10'>
          <Loading />
        </div>
      ) : (
      <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded'>
        <div className='overflow-x-auto'>
          <table className='w-full mb-5'>
            <TableHeader />
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <TableRow key={user._id || index} user={user} />
                ))
              ) : (
                <tr>
                  <td colSpan='5' className='p-2 text-center text-gray-500'>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Edit User Modal */}
      <AddUser 
        open={modals.edit} 
        setOpen={(open) => {
          setModals(prev => ({ ...prev, edit: open }));
          if (!open) setEditUser(null);
        }}
        userData={editUser}
        onUserAdded={() => {
          refetch();
        }}
      />

      {/* Add User Modal */}
      <AddUser 
        open={modals.add} 
        setOpen={(open) => setModals(prev => ({ ...prev, add: open }))}
        userData={null}
        onUserAdded={() => {
          refetch();
        }}
      />

      {/* Delete User Confirmation */}
      <ConfirmatioDialog
        open={modals.delete}
        setOpen={(open) => setModals(prev => ({ ...prev, delete: open }))}
        msg={selected ? `Are you sure you want to delete ${selected.name}? This action cannot be undone.` : ''}
        type='delete'
        onClick={deleteUserHandler}
      />

      {/* User Action Confirmation (Activate/Deactivate) */}
      <ConfirmatioDialog
        open={modals.action}
        setOpen={(open) => setModals(prev => ({ ...prev, action: open }))}
        msg={
          selected
            ? `Are you sure you want to ${selected.isActive ? 'disable' : 'activate'} ${selected.name}?`
            : ''
        }
        type={selected?.isActive ? 'disable' : 'activate'}
        onClick={userActionHandler}
      />
    </div>
  );
};

export default Users;