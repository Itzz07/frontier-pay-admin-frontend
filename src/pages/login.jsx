import React, { useState } from "react";
import firebase from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please fill all the fields",
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please provide a valid email",
        });
        return;
      }

      // Show loading spinner
      Swal.showLoading();

      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      
      // Hide loading spinner after authentication request is complete
      Swal.close();

      if (response.user) {
        setEmail("");
        setPassword("");
        // Redirect to home page
        navigate("/");
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "You have successfully logged in.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Login Error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form
        onSubmit={handleSubmit}
        className="grid place-items-center lg:w-5/12 sm:w-9/12 w-11/12 mx-auto bg-white backdrop-blur-lg text-[#4f7cff] drop-shadow-lg rounded-3xl"
      >
        <div className="pt-16 pb-4 font-bold capitalize text-blue-500">
        <h1 className="text-3xl">Login</h1>
        </div>

        {/* Email */}
        <div className="w-full flex flex-col px-14 py-8">
          <label
            htmlFor="email"
            className="font-bold capitalize text-blue-500 text-left"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-3 mt-1 text-lg outline-none"
            placeholder="example@123.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="w-full flex flex-col px-14 py-2">
          <label
            htmlFor="password"
            className="font-bold capitalize text-blue-500 text-left"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-3 mt-1 text-lg outline-none"
            placeholder="*******"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="w-full flex justify-between items-center px-14 pb-8 text-[#3d5fc4]">
          <div className="text-blue-500">Don't have an account?</div>
          <div className="text-blue-500">
            <a href="/register" className="hover:underline">
              Register Now
            </a>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mx-auto flex justify-center items-center pt-6 pb-16">
          <button
            type="submit"
            className="bg-[#3d5fc4] text-white rounded-md text-base uppercase w-24 py-2"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
