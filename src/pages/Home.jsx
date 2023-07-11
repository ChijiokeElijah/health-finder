import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import Spinner from '../components/Spinner'

export default function Home() {
  const [listings, setListings] = useState(null)
  // const [loading, setLoading] =useState(true)

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
   
  return (
    <div>
        <h1 className="">Home</h1>
    </div>
  )
}
