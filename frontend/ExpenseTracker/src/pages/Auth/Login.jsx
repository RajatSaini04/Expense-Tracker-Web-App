import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout.jsx'; // 👈 (Don't forget to import AuthLayout properly)
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input.jsx'; // 👈 (Don't forget to import Input properly)
import { Link } from 'react-router-dom'; // 👈 (Don't forget to import Link properly)
import { validateEmail } from '../../utils/helper'; // 👈 (Don't forget to import validateEmail properly)
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { useContext } from 'react'; // 👈 Add this if not already imported
import { UserContext } from '../../context/UserContext.jsx'; // ✅ Correct import

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);


  const navigate = useNavigate();

  //handle login form submit 
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      console.log("Invalid email")
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter a password');
      return;
    }
    setError("");



    // Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
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
            label=" Password"
            placeholder="Min 8 characters"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">
            LOGIN
          </button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/Signup">
              SignUp
            </Link>

          </p>
        </form>
      </div>
    </AuthLayout>
  );

};

export default Login;





// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import AuthLayout from '../../components/layouts/AuthLayout.jsx';
// import Input from '../../components/Inputs/Input.jsx';
// import { validateEmail } from '../../utils/helper';
// import axiosInstance from '../../utils/axiosInstance.js';
// import { API_PATHS } from '../../utils/apiPaths.js';
// import { useContext } from 'react'; // 👈 Add this if not already imported
// import { UserContext } from '../../context/UserContext.jsx'; // ✅ Correct import

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const { updateUser } = useContext(UserContext);


//   const navigate = useNavigate();

//   // Clear error when user starts typing
//   useEffect(() => {
//     if (error) setError(null);
//   }, [email, password]);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const trimmedEmail = email.trim();
//     const trimmedPassword = password.trim();

//     if (!validateEmail(trimmedEmail)) {
//       return setError('Please enter a valid email address');
//     }

//     if (!trimmedPassword) {
//       return setError('Please enter a password');
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
//         email: trimmedEmail,
//         password: trimmedPassword,
//       });

//       const { token } = response.data;

//       if (token) {
//         localStorage.setItem('token', token);
//         updateUser(user);
//         navigate('/dashboard');
//       }
//     } catch (err) {
//       const message =
//         err?.response?.data?.message || 'Something went wrong. Please try again later.';
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout>
//       <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
//         <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
//         <p className="text-xs text-slate-700 mt-1 mb-6">
//           Please enter your details to log in
//         </p>

//         <form onSubmit={handleLogin}>
//           <Input
//             value={email}
//             onChange={({ target }) => setEmail(target.value)}
//             label="Email Address"
//             placeholder="abc@example.com"
//             type="text"
//           />

//           <Input
//             value={password}
//             onChange={({ target }) => setPassword(target.value)}
//             label="Password"
//             placeholder="Min 8 characters"
//             type="password"
//           />

//           {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

//           <button type="submit" className="btn-primary" disabled={loading}>
//             {loading ? 'Logging in...' : 'LOGIN'}
//           </button>

//           <p className="text-[13px] text-slate-800 mt-3">
//             Don't have an account?{' '}
//             <Link className="font-medium text-primary underline" to="/Signup">
//               SignUp
//             </Link>
//           </p>
//         </form>
//       </div>
//     </AuthLayout>
//   );
// };

// export default Login;
