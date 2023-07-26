import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import ListingItem from '../components/ListingItem'
import Spinner from '../components/Spinner'



export default function FindHospital() {
const [hospitalListings, setHospitalListing] = useState(null)
const [state, setState] = useState('');
const [loading, setLoading] = useState(true)


useEffect(()=>{
  async function fetchHospitalListing(){
    try {
      const listingRef = collection(db, "Hospitals");
    const q = query(listingRef, where("State", "==", state),
    orderBy("timestamp", "desc"));
    const querySnap = await getDocs(q);
    let listings = [];
    querySnap.forEach((doc)=>{
      return listings.push({
        id: doc.id,
        data: doc.data(),
      })
    });
    setHospitalListing(listings)
    
    
    
    } catch (error) {
      console.log(error)
    }
    
    setLoading(false);
  }
  fetchHospitalListing();
}, [state])

function onChange(e){
setState(e.target.value.toUpperCase())
}


if(loading){
  <Spinner/>
}
  return (
    <div className="w-full md:h-screen text">
      <div className="max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-full h-[500px]">
      <h2 className='text-4xl text-[#08299B] font-semibold mb-6'>Find Hospital</h2>
      <input type='text' id='state' value={state} onChange={onChange} placeholder='Enter your State' className='border border-gray-400 '/>
      {hospitalListings && hospitalListings.length > 0 && (
        <div className='max-w-6xl mx-auto pt-4 space-y-6'>
          <h2 className='text-2xl mt-6 font-semibold'> Hospitals in {state} state</h2>
          <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
            {hospitalListings.map((listing)=>(
              <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
            ))}
          </ul>
        </div>
      )}
      </div>
      
    </div>
  )
}