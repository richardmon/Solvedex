import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Main } from "./pages/Main";
import Login from "./pages/Login";
import { signout } from "./lib/api";
import  Layout  from "./layout/Main";
import SignUp from "./pages/SignUp";

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
