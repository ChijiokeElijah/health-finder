import React from "react";
import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";


export default function SignIn() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  const { email, password } = formData;
  async function onSubmit(e){
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredentials = await  signInWithEmailAndPassword(auth, email, password)
      if(userCredentials.user){
        navigate("/")
      }
      
    } catch (error) {
      toast.error("Bad user credentials")
    }
  }
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">SignIn</h1>
      <div
        className="flex justify-center flex-wrap items-center 
      px-6 py-12 max-w-6xl mx-auto"
      >
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://media.istockphoto.com/id/1400388878/photo/closeup-african-american-woman-nurse-making-a-heart-shape-with-her-hands-while-smiling-and.jpg?s=612x612&w=0&k=20&c=25ezm8RAZOQZE2UaSIuY59txwZjcPBhaO5g2j6Osvyk="
            alt="key"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onSubmit}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email address"
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white  border-gray-300 rounded
             transition ease-in-out mb-6"
            />
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white  border-gray-300 rounded
             transition ease-in-out"
              />
              {showPassword ? (
                <AiFillEye
                  className="absolute right-3 top-3 text-xl cursor-pointer "
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEyeInvisible
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6">
                Don't have an account?
                <Link
                  to="/sign-up"
                  className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out"
                >
                  Register
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out ml-2"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
            <button
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
              type="submit"
            >
              Sign in
            </button>
            <div className="flex items-center my-4 after:border-t  after:flex-1  after:border-gray-300 before:border-t  before:flex-1  before:border-gray-300">
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}
