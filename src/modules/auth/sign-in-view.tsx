"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

const SignInView = () => {
  const router = useRouter();
  const [error, setError] = useState<String | null>(null);
  const [pending, setPending] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);
    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: (error) => {
          setError(error.error.message || "An error occurred while signing in");
          setPending(false);
          console.error("Sign in error:", error);
        },
      },
    );
  };

  const onSocial = (provider: "google") => {
    setError(null);
    setPending(true);
    authClient.signIn.social(
      {
        provider: provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          // router.push("/");
          setPending(false);
          console.log("Sign in successful with", provider);
        },
        onError: (error) => {
          setError(error.error.message || "An error occurred while signing in");
          setPending(false);
          console.error("Sign in error:", error);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to yout account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                {!!error && (
                  <Alert className="bg-destructive/10">
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={pending}>
                  Sign in
                </Button>

                <div className="relative my-1 text-center text-sm">
                  <div className="absolute inset-x-0 top-1/2 border-t border-border"></div>
                  <span className="bg-card relative z-10 px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>

                <div className="mt-1 gap-4">
                  <Button
                    type="button"
                    disabled={pending}
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      onSocial("google");
                    }}
                  >
                    <FaGoogle />
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="image" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-white">Ngerti-In</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInView;
