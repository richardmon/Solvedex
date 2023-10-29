// AUTH types
export type SignupFormData = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type SignupRequestData = Omit<SignupFormData, "passwordConfirmation">;

export type LoginFormData = {
  email: string;
  password: string;
};

// Posts
export type Post = {
  title: string;
  content: string | null;
  userId: number;
  id: number;
};

export type PostOverview = Pick<Post, "title" | "content">;

export type PostUpdate = Partial<Omit<Post, "userId" | "id">>;

export type PostCreate = Omit<Post, "userId" | "id">;
