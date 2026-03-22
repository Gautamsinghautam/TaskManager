import { apiSlice } from "../apiSlice";

const USER_URL = "/user";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get team list
        getTeamList: builder.query({
            query: () => ({
                url: USER_URL + "/get-team",
                method: "GET",
                credentials: "include",
            }),
        }),

        // Create new user
        createUser: builder.mutation({
            query: (data) => ({
                url: USER_URL + "/register",
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),

        // Update user by ID (Admin edit)
        updateUserById: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/${data._id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),

        // Delete user (soft delete - sets isActive to false)
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),

        // Toggle user active status
        userAction: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/${data.id}`,
                method: "PUT",
                body: { isActive: data.isActive },
                credentials: "include",
            }),
        }),

        // Update user profile
        updateUser: builder.mutation({
            query: (data) => ({
                url: USER_URL + "/profile",
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),

        getNotification: builder.query({
            query: () => ({
                url: USER_URL + "/notification",
                method: "GET",
                credentials: "include",
                }),
        }),

        markNotificationRead: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/read-noti?isReadType=${data.type}&id=${data.id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: USER_URL + "/change-password",
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),

    }),
});

export const {
    useGetTeamListQuery,
    useCreateUserMutation,
    useUpdateUserByIdMutation,
    useDeleteUserMutation,
    useUserActionMutation,
    useUpdateUserMutation,
    useGetNotificationQuery,
    useMarkNotificationReadMutation,
    useChangePasswordMutation,

} = userApiSlice;
