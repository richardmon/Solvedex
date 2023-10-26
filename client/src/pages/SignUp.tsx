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
import { signup } from "@/lib/api";
import { SignupFormData } from "@/types";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";


export default function LoginAccount() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();
  const password = watch("password", "");
  const mutation = useMutation(signup);
  const navigate = useNavigate();

  const submit = (data: SignupFormData) => {
    const {passwordConfirmation: _, ...signUpData} = data;
    mutation.mutate(signUpData, {
      onSuccess: (res: any) => {
        if (res.error) return;
        localStorage.setItem("apiKey", res.apiKey);
        localStorage.setItem("userId", res.userId);
        navigate("/");
      },
      onError: (e) => {
        console.error(e);
      }
    })
  };
  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <form
        onSubmit={handleSubmit(submit)}
        className="w-full m-auto bg-white lg:max-w-lg"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign up</CardTitle>
            <CardDescription className="text-center">
              Enter the following information to crate an account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                {...register("name", { required: "Name is required" })}
                id="name"
                type="text"
                placeholder="John Doe"
              />
              {errors.name && (
                <span className="text-red-500 text-xs">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                })}
                id="email"
                type="email"
                placeholder="johndoe@example.com"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password", { minLength: 8 })}
                id="password"
                type="password"
                placeholder="********"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="passwordConfirmation">Password</Label>
              <Input
                {...register("passwordConfirmation", {
                  required: "Please confirm password",
                  validate: (value) =>
                    value === password || "Passwords don't match.",
                })}
                id="passwordConfirmation"
                type="password"
              />
              {errors.passwordConfirmation && (
                <span className="text-red-500 text-xs">
                  {errors.passwordConfirmation.message}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
