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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <section className="w-full max-w-sm bg-white rounded-lg shadow-sm p-5 sm:p-6">
        <div className="mb-5">
          <h1 className="text-lg font-semibold text-gray-900">Log in</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
              Email address
            </label>
            <input
              {...register("email")}
              placeholder="Enter you email"
              className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm placeholder-gray-400
                         focus:outline-none focus:ring-0"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              {...register("password")}
              placeholder="Your password"
              className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm placeholder-gray-400
                         focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              disabled={formState.isSubmitting}
              className="px-4 py-2  rounded-md text-white bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-linear-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm text-center leading-5"
            >
              Log in
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
