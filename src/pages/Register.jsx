import React, { useState } from "react";
import firebase from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !fullname || !password) {
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

    try {
      Swal.showLoading(); // Show loading spinner

      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      // Update user profile
      await response.user.updateProfile({
        displayName: fullname,
      });

      // Retrieve UID
      const uid = response.user.uid;

      // Create reference to users node
      const userRef = firebase.firestore().collection("users").doc(uid);
      // const userRef = firebase.database().ref("users/" + uid);
      // db.collection('clients').doc();

      // Set user data in the database
      await userRef.set({
        uid: uid,
        email: email,
        username: fullname,
      });

      console.log("User registration successful!");

      // Reset form fields
      setFullname("");
      setEmail("");
      setPassword("");

      // Redirect to login page
      navigate("/login");
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "You have successfully registered and logged in.",
      });
    } catch (error) {
      console.error(
        "Error updating profile or writing to database:",
        error.message
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Registration Error",
      });
    }
  };

  return (
    <div className="flex items-center w-full mx-auto h-screen ">
      <form
        onSubmit={handleSubmit}
        className="grid place-items-center lg:w-5/12 sm:w-9/12 w-11/12 mx-auto bg-white text[#4f7cff] shadow-2xl rounded-3xl"
      >
        <div className="pt-16 pb-4 text-3xl font-bold capitalize text-blue-500">
          Register
        </div>

        <div className="w-full flex flex-col px-14 py-2 ">
          <label
            htmlFor="fullname"
            className="font-bold capitalize text-blue-500 text-left "
          >
            Fullname
          </label>
          <input
            type="text"
            id="fullname"
            className="w-full border border-gray-300 rounded-lg px-3 py-3 mt-1 text-lg outline-none"
            placeholder="Enter Fullname"
            required
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="w-full flex flex-col px-14 py-2">
          <label
            htmlFor="email"
            className="font-bold capitalize text-blue-500 text-left"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full border  border-gray-300 rounded-lg px-3 py-3 mt-1 text-lg outline-none"
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
            className=" font-bold capitalize text-blue-500  text-left"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full border  border-gray-300 rounded-lg px-3 py-3 mt-1 text-lg outline-none"
            placeholder="*******"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="w-full flex justify-between items-center px-14 pb-8 text-[#3d5fc4]">
          <div className="text-blue-500">Already have an account?</div>
          <div className="text-blue-500">
            <a href="/login" className="hover:underline">
              Login Now
            </a>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mx-auto flex justify-center items-center pt-6 pb-16">
          <button
            type="submit"
            className="bg-[#3d5fc4] text-white rounded-md text-base uppercase w-24 py-2"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
