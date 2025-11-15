import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/todos"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Go back Home
        </Link>

        <div className="mt-4">
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
