import  { useEffect, useState } from 'react'
import logo from "../images/logo.png"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {getAuth, onAuthStateChanged} from  "firebase/auth";
import {FaBars} from "react-icons/fa"
import {FaTimes} from "react-icons/fa"


export default function Header() {
  const [pageState, setPageState] = useState("Sign in")
  const navigate = useNavigate()
  const location = useLocation()
  const [nav, setNav] = useState(false)
  const handleClick = () => setNav(!nav);
  const auth = getAuth();
  useEffect(()=>{
    onAuthStateChanged(auth, (user)=>{
      if(user){
        setPageState("Profile")
      }else{
        setPageState("Sign in")
      }
    })
  }, [auth])
  function pathMatchRoute(route){
    if(route === location.pathname)
    return true
  }
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-40'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
          <img src={logo} alt="logo" className='h-10 cursor-pointer'
          onClick={()=>navigate
          ("/")}/>
        </div>
        <div>
          <ul className='flex space-x-10 hidden md:flex'>
            <li className={`py-3 text-sm font-semibold text-gray-300 border-b-[3px] border-b-transparent cursor-pointer ${pathMatchRoute("/") && "!text-black !border-b-green-500"}`}  onClick={()=>navigate
          ("/")}>Home</li>
                      <li className={`py-3 text-sm font-semibold text-gray-300 border-b-[3px] border-b-transparent cursor-pointer ${pathMatchRoute("/find-hospital") && "!text-black !border-b-green-500"}`}  onClick={()=>navigate
          ("/find-hospital")}>Find Hospital</li>

            <li className={`py-3 text-sm font-semibold text-gray-300 border-b-[3px] border-b-transparent cursor-pointer 
            ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && "!text-black !border-b-green-500"}`}  
            onClick={()=>navigate
          ("/profile")}>{pageState}</li>
          </ul>
        </div>

        {/* Handbugger */}
        <div onClick={handleClick} className='md:hidden z-10'>
          {!nav ? <FaBars/> : <FaTimes/>}

          {/* Mobile menu */}
          <ul className={
            !nav ? "hidden"
            : "absolute top-0 left-0 w-full h-screen  flex flex-col justify-center items-center"
          }>
            <li className='py-6 text-4xl'><Link onClick={handleClick} to="/" >Home</Link></li>
            <li className='py-6 text-4xl'><Link onClick={handleClick} to="find-hospital">Find Hospital</Link></li>
            <li className='py-6 text-4xl'><Link onClick={handleClick} to="sign-in">Sign In</Link></li>
            <li className='py-6 text-4xl'><Link onClick={handleClick} to="sign-up">Sign Up</Link></li>


          </ul>
        </div>
      </header>
    </div>
  ) 
}
