import React, { useState, useContext } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout.jsx';
import Input from '../../components/Inputs/Input.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/UserContext.jsx';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Prevent multiple clicks
    if (loading) return;

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    setError('');
    setLoading(true);

    const toastId = toast.loading("Signing you in...");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);

        updateUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Welcome back!", {
          id: toastId,
        });

        navigate("/dashboard");
      }
    } catch (error) {
      toast.dismiss(toastId);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
        toast.error("Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          Welcome Back
        </h3>

        <p className="text-xs text-slate-700 dark:text-slate-400 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="abc@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
          />

          {error && (
            <p className="text-red-500 text-xs pb-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary transition-all duration-200 ${loading
                ? "opacity-70 cursor-not-allowed"
                : ""
              }`}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <p className="text-[13px] text-slate-800 dark:text-slate-400 mt-3">
            Don't have an account?{" "}
            <Link
              className="font-medium text-primary underline"
              to="/Signup"
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;