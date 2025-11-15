import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <section className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <header className="mb-4">
          <h1 className="text-xl sm:text-2xl font-medium text-gray-900">
            Create account
          </h1>
        </header>

        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-700 mb-1">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400
                         focus:outline-none focus:ring-0"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400
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
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-400
                         focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 cursor-pointer"
            >
              Create account
            </button>

            <Link to="/" className="text-sm text-gray-600 hover:underline">
              Already have an account?
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Signup;
