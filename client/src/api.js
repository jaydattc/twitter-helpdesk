import axios from "axios";
import { BACKEND_URI } from "config";

const api = (
  options = {
    cancelToken: null,
    isHandlerDisabled: false,
  }
) => {
  const { cancelToken, isHandlerDisabled } = options;
  const axiosInstance = axios.create({
    baseURL: BACKEND_URI,
    cancelToken,
  });
  if (!isHandlerDisabled)
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!axios.isCancel(error)) {
          const response = error.response;
          if (response.status === 401) {
            // auto logout if 401 response returned from api
            // clear localstorage or a logout method
            localStorage.clear();
            window.location && window.location.replace("/");
          } else if (response.status === 400) {
            let description = response.data;
            return Promise.reject({ ...error, description });
          }
          const description =
            (response.data && response.data.message) ||
            (response.data && response.data.error);
          return Promise.reject({ ...error, description });
        }
      }
    );
  return axiosInstance;
};

export default api;
