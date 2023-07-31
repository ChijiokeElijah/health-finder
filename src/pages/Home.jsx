import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import Spinner from '../components/Spinner'
import hero from "../images/hero.jpg"
import { Link } from 'react-router-dom'
import FindHospital from './FindHospital'

export default function Home() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function fetchListings(){
      try {
        //get reference
        const listingsRef = collection(db, 'hospitals')
        //create the query
        const q = query(listingsRef, orderBy('timestamp', "desc"))
        //execute query
        const querySnap = await getDocs(q)
        const listings = [];
        querySnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setListings(listings)
      } catch (error) {
        
      }
    }
    fetchListings()

  },[])
  
  if(loading){
    <Spinner/>
  }
   
  return (
    <div className="flex justify-center flex-wrap flex-cols items-center max-w-6xl mx-auto h-fit-content">
        
        <div className="md:w-[67%] lg:w-[40%] mb-12 md:mt-10 md:mb-6 ">
          <h1 className='text-[#08299B] text-center font-Roboto mt-20 px-12 lg:text-4xl text-3xl '>Find Hospitals nearest to you</h1>
          <h2 className='text-gray-600 lg:text-2xl mt-6 text-center text-lg'> Discover your perfect care: Find your Hospital, Anytime, Anywhere.</h2>
          <div className=' flex flex-col items-center justify center'>
          <button className='h-[50px] w-[150px] bg-[#08299B] hover:bg-blue-700 text-white rounded-lg text-center mt-6 mb-12'><Link to={'/find-hospital'}>Find Hospital</Link></button>
          </div>
        </div>
        <div className="w-full md:w-[67%] lg:w-[50%] lg:ml-20  lg:mt-20 sm:py-2 mb-6">
          <img  src={hero}
 alt='' className='w-full rounded-2xl' />
        </div>

        <div name='about' className="w-full md:h-screen">
        <div className="max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-[500px]">
          <h2 className='lg:text-4xl text-2xl text-[#08299B] font-semibold mb-8'>About Us</h2>
          <p className='lg:text-2xl text-xl'>CareFinder helps you find the best hospitals and medical centers within your region.
            We provide you with a list of Hospitals around you and their respective contact details, including address, phone number, and email.
            We help you navigate to the hospital of your choice through the help a map.
            You can also share the link of your selected hospital or export a list of hospitals within your selected area with family and friends. 
          </p>
        </div>
        </div>
        <div name='find-hospital' className="w-full md:h-screen">
        <div className="max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-[500px]">
          <FindHospital/>
        </div>
        </div>
    </div>
    
  )
}
