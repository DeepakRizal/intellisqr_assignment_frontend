import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuthStore } from "../store/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api/axios";
import { useMutation } from "@tanstack/react-query";

const schema = z.object({
  email: z.string().refine((value) => value.includes("@"), {
    message: "Invalid email",
  }),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await api.post("/user/login", payload);
      return res.data;
    },
    onSuccess: (data) => {
      const { token, user } = data;
      setAuth(token, user);
      navigate("/todos");
    },
    onError: (data) => {
      console.log(data);
    },
  });

  const onSubmit = async (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <section className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 sm:p-7">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-gray-900">Log in</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back — please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              {...register("email")}
              placeholder="Enter your email"
              aria-invalid={Boolean(formState.errors?.email)}
              className="block w-full px-3 py-2 rounded-lg border border-gray-200 text-sm placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              {...register("password")}
              placeholder="Enter your password"
              type="password"
              aria-invalid={Boolean(formState.errors?.password)}
              className="block w-full px-3 py-2 rounded-lg border border-gray-200 text-sm placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 cursor-pointer"
            >
              {formState.isSubmitting ? "Signing in…" : "Log in"}
            </button>

            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 hover:underline"
            >
              Forgot?
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create one
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Login;
