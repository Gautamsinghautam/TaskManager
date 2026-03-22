// import { logoutUser, registerUser } from "../../../../../backend/controllers/userController";
import { apiSlice } from "../apiSlice";

const AUTH_URL = "/user";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (data) => ({
                url: AUTH_URL + "/login",
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),
        
        register: builder.mutation({
            query: (data) => ({
                url: AUTH_URL + "/register",
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),

        logout: builder.mutation({
            query: (data) => ({
                url: AUTH_URL + "/logout",
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),

        getTeam: builder.query({
            query: () => ({
                url: AUTH_URL + "/get-team",
                method: "GET",
                credentials: "include",
            }),
        }),
    }),
});


export const { useLoginUserMutation, useRegisterMutation, useLogoutMutation, useGetTeamQuery } = authApiSlice;