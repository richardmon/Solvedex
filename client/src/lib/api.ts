import { LoginFormData, SignupRequestData } from "@/types";

const getHeaders = () => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const apiKey = localStorage.getItem("apiKey");
  if (apiKey) {
    headers["X-API-KEY"] = apiKey;
  }

  return headers;
};

const baseUrl = import.meta.env.VITE_SERVER_URL;

// AUTH
// NOTE: I'm being super optimistic here, it would be good idea to check the responses with zod or yup
export const signup = async (data: SignupRequestData) => {
  const response = await fetch(`${baseUrl}/api/v1/auth/signup`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const login = async (data: LoginFormData) => {
  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
};

export const signout = () => {
  localStorage.removeItem("apiKey");
  localStorage.removeItem("userId");
};

// Blogs

export const getAllPosts = async () => {
  const response = await fetch(`${baseUrl}/api/v1/posts`, {
    headers: getHeaders(),
  });
  return response.json();
};
