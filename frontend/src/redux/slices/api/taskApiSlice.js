import { apiSlice } from "../apiSlice";

const TASK_URL = "/task";

export const taskApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getDashboardStats: builder.query({
            query: () => ({
                url: `${TASK_URL}/dashboard`,
                method: "GET",
                credentials: "include",
            }),
            }),
        
        // Get all tasks
        getAllTasks: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams({
                    stage: params?.strQuery || "",
                    isTrashed: params?.istrashed || "",
                    search: params?.search || ""
                }).toString();
                return {
                    url: `${TASK_URL}?${queryString}`,
                    method: "GET",
                    credentials: "include",
                };
            },
            providesTags: ["Task"],
        }),

        // Get single task
        // getTask: builder.query({
        //     query: (id) => ({
        //         url: `${TASK_URL}/${id}`,
        //         method: "GET",
        //         credentials: "include",
        //     }),
        // }),

        // // Create new task
        createTask: builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/create`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Task"],
        }),

        // // Update task
        updateTask: builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/update/${data.id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Task"],
        }),

        // // Trash task (move to trash, not permanent delete)
        trashTask: builder.mutation({
            query: (id) => ({
                url: `${TASK_URL}/${id}`,
                method: "PUT",
                credentials: "include",
            }),
            invalidatesTags: ["Task"],
        }),

        // // Duplicate task
        duplicateTask: builder.mutation({
            query: (id) => ({
                url: `${TASK_URL}/duplicate/${id}`,
                method: "POST",
                body: { id },
                credentials: "include",
            }),
            invalidatesTags: ["Task"],
        }),

        // // Trash/Delete task
        // trashTask: builder.mutation({
        //     query: (id) => ({
        //         url: `${TASK_URL}/${id}`,
        //         method: "PUT",
        //         credentials: "include",
        //     }),
        // }),

        // Delete/Restore task
        deleteRestoreTask: builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/delete-restore/${data.id}?actionType=${data.actionType}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Task"],
        }),

        // // Create subtask
        createSubTask: builder.mutation({
            query: (data) => {
                const { id, ...body } = data;
                return {
                    url: `${TASK_URL}/create-subtask/${id}`,
                    method: "PUT",
                    body,
                    credentials: "include",
                };
            },
            invalidatesTags: ["Task"],
        }),

        // // Post task activity
        postTaskActivity: builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}/activity/${data.id}`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),

        // Get dashboard statistics
        getDashboardStats: builder.query({
            query: () => ({
                url: `${TASK_URL}/dashboard`,
                method: "GET",
                credentials: "include",
            }),
        }),
    }),
});

export const {
    useGetTasksQuery,
    useGetTaskQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDuplicateTaskMutation,
    useTrashTaskMutation,
    useDeleteRestoreTaskMutation,
    useCreateSubTaskMutation,
    usePostTaskActivityMutation,
    useGetDashboardStatsQuery,
    useGetAllTasksQuery,
} = taskApiSlice;
