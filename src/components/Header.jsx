import  { useEffect, useState } from 'react'
import logo from "../images/logo.png"
import { useLocation, useNavigate } from 'react-router-dom'
import {getAuth, onAuthStateChanged} from  "firebase/auth";
import {FaBars, FaTimes} from "react-icons/fa"
import {Link} from 'react-router-dom'


export default function Header() {
  const [pageState, setPageState] = useState("Sign In")
  const [pageState2, setPageState2] = useState("Sign up")
  const navigate = useNavigate()
  const location = useLocation()
  const [nav, setNav] = useState(false)

  function onLogOut() {
    auth.signOut();
    navigate("/sign-up");
  }
  const handleClick = () => setNav(!nav);
  const auth = getAuth();
  useEffect(()=>{
    onAuthStateChanged(auth, (user)=>{
      if(user){
        setPageState("Profile")
        setPageState2("Log Out")
      }else{
        setPageState("Sign in")
        setPageState2("Sign up")
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
            <li className={`py-3 text-sm font-semibold text-gray-300 border-b-[3px] border-b-transparent cursor-pointer ${pathMatchRoute("/") && "!text-black !border-b-[#08299B]"}`}  onClick={()=>navigate
          ("/")}>Home</li>
            <li className={`py-3 text-sm font-semibold text-gray-300 border-b-[3px] border-b-transparent cursor-pointer ${pathMatchRoute("/find-hospital") && "!text-black !border-b-[#08299B]"}`}><Link to='/find-hospital'>Find Hospital</Link> </li>
            <li className={`py-3 text-sm font-semibold text-gray-300 border-b-[3px] border-b-transparent cursor-pointer 
            ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && "!text-black !border-b-[#08299B]"}`}  
            onClick={()=>navigate
          ("/profile")}>{pageState}</li>
           <li className={`py-3 text-sm font-semibold text-gray-300 border-b-[3px] border-b-transparent cursor-pointer 
            ${(pathMatchRoute("/sign-up")) && "!text-black !border-b-[#08299B]"}`}  
            onClick={onLogOut}>{pageState2}</li>
          </ul>
        </div>

        {/* Handbugger */}
        <div onClick={handleClick} className='md:hidden z-50'>
          {!nav ? <FaBars/> : <FaTimes/>}

          {/* Mobile menu */}
          <ul className={
            !nav ? "hidden"
            : "absolute top-12 left-0 w-full h-screen  flex flex-col justify-center items-center bg-slate-50 bg-opacity-80"
          }>
            <li className='py-6 text-2xl text-[#08299B]'><Link to="/" >Home</Link></li>
            <li className='py-6 text-2xl text-[#08299B]'><Link to="/find-hospital">Find Hospital</Link></li>
            <li className={`py-6 text-2xl text-[#08299B] ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile"))}`}><Link to="/profile">{pageState}</Link></li>
            <li className={`py-6 text-2xl text-[#08299B] ${(pathMatchRoute("/sign-up")) }`} onClick={onLogOut} >{pageState2}</li>
          </ul>
        </div>
      </header>
    </div>
  ) 
}
