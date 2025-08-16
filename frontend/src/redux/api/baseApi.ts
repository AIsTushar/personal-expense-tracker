/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState } from "../store";
// import { logout, setAccessToken } from "../features/auth";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://personal-expense-tracker-backend-inky.vercel.app/api/v1",

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.accessToken;
    if (token) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // if (result.error && result.error.status === 401) {
  //   // Refresh access token
  //   const refreshResult = await baseQuery(
  //     {
  //       url: "/auth/refresh-token",
  //       method: "POST",
  //       // body:
  //     },
  //     api,
  //     extraOptions
  //   );

  //   if (refreshResult.data) {
  //     const newAccessToken = (refreshResult.data as any).accessToken;

  //     api.dispatch(setAccessToken(newAccessToken));
  //   } else {
  //     api.dispatch(logout());
  //   }
  // }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Expenses"],
  endpoints: () => ({}),
});

export default baseApi;
