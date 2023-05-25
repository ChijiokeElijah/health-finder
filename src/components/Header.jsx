import React from 'react'
import logo from "../images/logo.png"
import { useLocation, useNavigate } from 'react-router-dom'
export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  function pathMatchRoute(route){
    if(route === location.pathname)
    return true
  }
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
          <img src={logo} alt="logo" className='h-10 cursor-pointer'
          onClick={()=>navigate
          ("/")}/>
        </div>
        <div>
          <ul className='flex space-x-10'>
            <li className={`py-3 text-sm font-semibold text-gray-300 border-b-[3px] border-b-transparent cursor-pointer ${pathMatchRoute("/") && "!text-black !border-b-green-500"}`}  onClick={()=>navigate
          ("/")}>Home</li>
            <li className={`py-3 text-sm font-semibold text-gray-300 border-b-[3px] border-b-transparent cursor-pointer ${pathMatchRoute("/sign-in") && "!text-black !border-b-green-500"}`}  onClick={()=>navigate
          ("/sign-in")}>Sign in</li>
          </ul>
        </div>
      </header>
    </div>
  ) 
}
