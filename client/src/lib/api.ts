import {
  LoginFormData,
  PostCreate,
  PostUpdate,
  SignupRequestData,
} from "@/types";

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

export const getSpecificPost = async (id: number) => {
  const response = await fetch(`${baseUrl}/api/v1/posts/${id}`, {
    headers: getHeaders(),
  });
  return response.json();
};

export const createPost = async (post: PostCreate) => {
  const response = await fetch(`${baseUrl}/api/v1/posts/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error("Post creation failed");
  }

  return response.json();
};

export const deletePost = async (id: number) => {
  const response = await fetch(`${baseUrl}/api/v1/posts/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response.json();
};

export const updatePost = async ({
  id,
  data,
}: {
  id: number;
  data: PostUpdate;
}) => {
  const response = await fetch(`${baseUrl}/api/v1/posts/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Post update failed");
  }

  return response.json();
};
