import nock from "nock";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginAccount from "@/pages/Login";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const queryClient = new QueryClient();

const MockHomePage: React.FC = () => {
  return <button>Logout</button>;
};

const customRender = (children: React.ComponentType) =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" Component={children} />
          <Route path="/" Component={MockHomePage} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );

describe("LoginAccount Integration Test", () => {
  it("should login successfully and navigate to the homepage", async () => {
    // Mock the successful login response
    nock("http://localhost:3000")
      .post("/api/v1/auth/login", {
        email: "user@example.com",
        password: "password123",
      })
      .reply(200, { apiKey: "sampleApiKey", userId: "sampleUserId" });

    const { getByLabelText, getByTestId } = customRender(LoginAccount);

    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(getByTestId("login-button"));

    // Check for redirect
    await waitFor(() => {
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });
  });

  it("should show an error message on failed login", async () => {
    // Mock the failed login response
    nock("http://localhost:3000")
      .post("/api/v1/auth/login", {
        email: "user@example.com",
        password: "wrongpassword",
      })
      .reply(401, { error: "Invalid email or password" });

    const { getByLabelText, getByTestId, getByText } = customRender(LoginAccount);

    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(getByTestId("login-button"));

    await waitFor(() => {
      expect(getByText(/Invalid email or password/i));
    });
  });
});
