// api.js
import { createApi } from "@reduxjs/toolkit/query";
import axiosInstance from "./axios";
import { AxiosError } from "axios";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const api = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl: "https://example.com",
  }),
  endpoints(build) {
    return {
      query: build.query({
        query: () => ({
          url: "/query",
          method: "get",
          data: {},
          headers: {},
          params: {},
        }),
      }),
      mutation: build.mutation({
        query: () => ({
          url: "/mutation",
          method: "post",
          data: {},
          headers: {},
          params: {},
        }),
      }),
    };
  },
});
