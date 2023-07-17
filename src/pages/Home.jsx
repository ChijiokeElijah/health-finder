import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import Spinner from '../components/Spinner'
import hero from "../images/hero.jpg"
import { Link } from 'react-router-dom'

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
        console.log(listings);
      } catch (error) {
        
      }
    }
    fetchListings()

  },[])
  
  if(loading){
    <Spinner/>
  }
   
  return (
    <div className="flex justify-center flex-wrap flex-cols items-center max-w-6xl mx-auto h-screen">
        
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mt-10 md:mb-6 ">
          <h1 className='text-[#08299B] text-4xl text-center font-Roboto mt-20 px-12  '>Find Hospitals nearest to you</h1>
          <h2 className='text-gray-600 text-2xl mt-6 text-center'> Discover your perfect care: Find your Hospital, Anytime, Anywhere.</h2>
          <div className=' flex flex-col items-center justify center'>
          <button className='h-[50px] w-[150px] bg-[#08299B] text-white rounded-lg text-center mt-6 mb-12'><Link to={'/find-hospital'}>Find Hospital</Link></button>
          </div>
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20 sm:py-2 sm:py-3">
          <img src={hero} alt='' className='w-full rounded-2xl' />
        </div>
    </div>
  )
}
