import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().refine((value) => value.includes("@"), {
    message: "Invalid email",
  }),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await api.post("/auth/forgot-password", payload);
      return res.data;
    },
    onSuccess: () => {
      setSent(true);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Forgot password
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your account email and we’ll send instructions to reset your
          password in your email.
        </p>

        {sent ? (
          <div className="p-4 rounded-md bg-green-50 border border-green-100">
            <p className="text-sm text-green-800">
              If an account with that email exists, we’ve sent password reset
              instructions.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                {...register("email")}
                type="email"
                placeholder="Enter your gmail"
                className={`w-full px-3 py-2 rounded-md border text-sm focus:outline-none placeholder-gray-400 ${
                  errors.email
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200 focus:ring-blue-300"
                }`}
                disabled={isSubmitting || mutation.isPending}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 cursor-pointer"
              >
                {isSubmitting || mutation.isPending
                  ? "Sending..."
                  : "Send reset link"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default ForgotPassword;
