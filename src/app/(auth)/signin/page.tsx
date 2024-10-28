"use client";
<<<<<<< HEAD
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
=======
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
>>>>>>> parent of 1817a9b (ui changes)
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signinSchema } from "@/schema/signinSchema";
=======
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signinSchema } from "@/schema/signinSchema";
import { signIn } from "next-auth/react";
>>>>>>> parent of 1817a9b (ui changes)

const SigninPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
<<<<<<< HEAD
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
      callbackUrl: '/dashboard',
    });

    if (!result) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    if (result?.error) {
      switch (result.error) {
        case "CredentialsSignin":
=======
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      if (result?.error) {
        if (result.error === "CredentialsSignin") {
>>>>>>> parent of 1817a9b (ui changes)
          toast({
            title: "Login Failed",
            description: "Incorrect username or password",
            variant: "destructive",
          });
<<<<<<< HEAD
          break;
        case "VerificationRequired":
          toast({
            title: "Account Not Verified",
            description: "Please verify your account before logging in.",
            variant: "destructive",
          });
          break;
        default:
          toast({
            title: "Error",
            description: result.error || "Unexpected error occurred",
            variant: "destructive",
          });
=======
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        }
>>>>>>> parent of 1817a9b (ui changes)
      }
      console.log(result);
      if (result?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

<<<<<<< HEAD
    if (result?.url) {
      router.push("/dashboard");
    }

  };
=======
>>>>>>> parent of 1817a9b (ui changes)
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input type="text" placeholder="username/email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
<<<<<<< HEAD
            <Button className="w-full" type="submit">
              Signin
=======
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Signin"
              )}
>>>>>>> parent of 1817a9b (ui changes)
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
};

export default SigninPage;
>>>>>>> parent of 1817a9b (ui changes)
