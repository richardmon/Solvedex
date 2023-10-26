import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";
import { LoginFormData } from "@/types";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";

export default function LoginAccount() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const mutation = useMutation(login);
  const navigate = useNavigate();

  const submit = (data: LoginFormData) => {
    mutation.mutate(data, {
      onSuccess: (res) => {
        if (res.error) return;
        localStorage.setItem("apiKey", res.apiKey);
        localStorage.setItem("userId", res.userId);
        navigate("/");
      },

      onError: (e) => {
        console.error(e);
      },
    });
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <form
        onSubmit={handleSubmit(submit)}
        className="w-full m-auto bg-white lg:max-w-lg"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to login
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder=""
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password should be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full">Login</Button>
          </CardFooter>
          <p className="mt-2 text-xs text-center text-gray-700 mb-2">
            {" "}
            Don't have an account?{" "}
            <Link to="/signup" className=" text-blue-600 hover:underline">Sign up</Link>
          </p>
        </Card>
      </form>
    </div>
  );
}
