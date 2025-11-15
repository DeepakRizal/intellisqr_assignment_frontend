import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const ResetPassword = () => {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: async (payload: { password: string }) => {
      const res = await api.post(`/auth/reset-password/${token}`, payload);
      return res.data;
    },
  });

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password", { replace: true });
    }
  }, [token, navigate]);

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { password: data.password },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  const mutationErrorMessage = mutation.isError
    ? mutation.error instanceof Error
      ? mutation.error.message
      : String(mutation.error)
    : null;

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Reset password
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Create a new password for your account.
        </p>

        {mutation.isSuccess ? (
          <div className="p-4 rounded-md bg-green-50 border border-green-100">
            <p className="text-sm text-green-800 mb-3">
              Your password has been reset successfully.
            </p>
            <button
              onClick={() => navigate("/")}
              className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-gray-700 mb-1"
              >
                New password
              </label>
              <input
                id="password"
                {...register("password")}
                type="password"
                placeholder="Enter new password"
                className={`w-full px-3 py-2 rounded-md border text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200 focus:ring-blue-300"
                }`}
                disabled={isSubmitting || mutation.isPending}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />
              {errors.password?.message && (
                <p id="password-error" className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm text-gray-700 mb-1"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm new password"
                className={`w-full px-3 py-2 rounded-md border text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200 focus:ring-blue-300"
                }`}
                disabled={isSubmitting || mutation.isPending}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "confirm-password-error" : undefined
                }
              />
              {errors.confirmPassword?.message && (
                <p
                  id="confirm-password-error"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {mutationErrorMessage && (
              <p className="text-sm text-red-600">{mutationErrorMessage}</p>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 cursor-pointer"
              >
                {isSubmitting || mutation.isPending
                  ? "Resetting..."
                  : "Reset password"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 hover:underline"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default ResetPassword;
