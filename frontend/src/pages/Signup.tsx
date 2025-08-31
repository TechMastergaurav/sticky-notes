import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock, User } from "lucide-react";

export default function Signup() {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success("Account created successfully!");
      setLoading(false);
    }, 1500);
        navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 lg:px-20 bg-white shadow-md">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium 
                         hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign up"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Quote */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50 p-10">
        <blockquote className="max-w-md text-gray-800">
          <p className="text-2xl font-semibold mb-4">
          “Exactly what I needed—a personal space for my thoughts, always accessible.”
          </p>
          <footer className="text-sm text-gray-600">
            <strong className="block">Julies Winfield</strong>
            <span className="text-gray-500">CEO | Acme Corp</span>
          </footer>
        </blockquote>
      </div>
    </div>
  );
}



