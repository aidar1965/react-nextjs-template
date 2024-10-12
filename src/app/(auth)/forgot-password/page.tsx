"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const PasswordRecoveryPage = () => {
  const router = useRouter();
  const [recoveryError, setRecoveryError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const recoveryMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Имитация запроса на восстановление пароля
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (values.email === "test@example.com") {
            reject(new Error("Email not found"));
          } else {
            resolve({ success: true });
          }
        }, 1000);
      });
    },
    onSuccess: () => {
      toast({
        title: "Password Reset Email Sent",
        description: "A password reset link has been sent to your email.",
        duration: 3000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    },
    onError: (error: Error) => {
      setRecoveryError(error.message || "An error occurred during password recovery. Please try again.");
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setRecoveryError("");
    await recoveryMutation.mutateAsync(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Password Recovery</h2>
        </CardHeader>
        <CardContent>
          {recoveryError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{recoveryError}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={recoveryMutation.isPending}
              >
                {recoveryMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Send Recovery Email"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Remembered your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PasswordRecoveryPage;