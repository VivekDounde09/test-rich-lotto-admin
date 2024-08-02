import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const isDevelopment = process.env.NODE_ENV !== 'production';
const isProductionApp = process.env.APP_ENV === 'production';

export const isLoggedIn = () => {
  return Boolean(Cookies.get(`${process.env.APP_ENV}__admin__isLoggedIn`));
};

export const setAuthCookie = () => {
  return Cookies.set(
    isDevelopment
      ? 'test__user__isLoggedIn'
      : isProductionApp
      ? '__user__isLoggedIn'
      : `${isProductionApp}__user__isLoggedIn`,
    'true',
    { expires: 1 },
  );
};
export const removeAuthCookie = () => {
  Cookies.remove('token');
  return Cookies.remove(
    isDevelopment
      ? 'test__user__isLoggedIn'
      : isProductionApp
      ? '__user__isLoggedIn'
      : `${isProductionApp}__user__isLoggedIn`,
    'true',
    { expires: 1 },
  );
};

const getUserToken = () => {
  if (Cookies.get('__adminAuthToken')) {
    return Cookies.get('__adminAuthToken');
  } else return false;
};

export const showErrorMessage = (message) => {
  if (message instanceof Array) {
    message.forEach((msg) => toast.error(msg));
  } else {
    toast.error(message);
  }
};

const responseFormatter = (status, data, error) => {
  return { status, data: data || null, error };
};

const handleApiError = (err) => {
  return responseFormatter(false, null, err.response?.data);
};

export const postReq = async (endpoint, data) => {
  const url = process.env.API_URL + endpoint;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${getUserToken()}`,
  };
  return await axios
    .post(url, data, { withCredentials: true, headers })
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((err) => {
      console.log(err);
      return handleApiError(err);
    });
};

export const patchReq = async (endpoint, data) => {
  const url = process.env.API_URL + endpoint;

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${getUserToken()}`,
  };

  return await axios
    .patch(url, data, { withCredentials: true, headers })
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((err) => {
      return handleApiError(err);
    });
};

export const getReq = async (endpoint) => {
  const url = process.env.API_URL + endpoint;

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${getUserToken()}`,
  };

  return await axios
    .get(url, { withCredentials: true, headers })
    .then((response) => {
      return responseFormatter(true, response.data, null);
    })
    .catch((err) => {
      return handleApiError(err);
    });
};

export const postFile = async (endpoint, data) => {
  const url = process.env.API_URL + endpoint;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${getUserToken()}`,
    'Content-Type': 'multipart/form-data',
  };

  try {
    const response = await axios.post(url, data, {
      withCredentials: true,
      headers,
    });
    return responseFormatter(true, response.data, null);
  } catch (err) {
    console.log(err);
    return handleApiError(err);
  }
};
