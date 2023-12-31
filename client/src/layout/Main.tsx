import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFetcher } from "react-router-dom";
import { Outlet } from "react-router-dom";

const Layout = () => {
  let fetcher = useFetcher();
  const isLoggedIn = localStorage.getItem("apiKey");
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">My App</Link>
        {isLoggedIn && (
          <fetcher.Form method="post" action="/logout">
            <Button variant="ghost" data-testid="logout-button">Logout</Button>
          </fetcher.Form>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 bg-gray-100">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white p-4">
        <p className="text-center">© 2023 My App. Hope you like it.</p>
      </footer>
    </div>
  );
};

export default Layout;
