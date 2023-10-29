import {
  RouterProvider,
  createBrowserRouter,
  LoaderFunctionArgs,
  redirect,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Main } from "./pages/Main";
import Login from "./pages/Login";
import { getSpecificPost, signout } from "./lib/api";
import Layout from "./layout/Main";
import SignUp from "./pages/SignUp";
import Post from "./pages/Post";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: Layout,
    children: [
      {
        path: "login",
        loader: loginLoader,
        Component: Login,
      },
      {
        path: "signup",
        loader: loginLoader,
        Component: SignUp,
      },
      {
        index: true,
        loader: protectedLoader,
        Component: Main,
      },
      {
        path: "/post",
        loader: protectedLoader,
        Component: Post,
      },
      {
        path: "/post/:id",
        loader: postLoader,
        Component: Post,
      },
    ],
  },
  {
    path: "/logout",
    async action() {
      signout();
      return redirect("/login");
    },
  },
]);

async function loginLoader() {
  const apiKey = localStorage.getItem("apiKey");
  if (apiKey) {
    return redirect("/");
  }
  return null;
}

async function protectedLoader() {
  const apiKey = localStorage.getItem("apiKey");
  if (!apiKey) {
    return redirect("/login");
  }
  return null;
}

async function postLoader({ params }: LoaderFunctionArgs) {
  await protectedLoader();
  const postId = params["id"];
  if (!postId) {
    throw new Response("Not Found", { status: 404 });
  }
  return await getSpecificPost(Number(postId));
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        fallbackElement={<p>Initial Load...</p>}
      />
    </QueryClientProvider>
  );
}

export default App;
