import React from 'react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { db } from "../firebase";
import {doc, getDoc} from 'firebase/firestore'
import Spinner from "../components/Spinner";
import {FaCopy, FaMapMarkerAlt} from "react-icons/fa"
import {GiRotaryPhone} from 'react-icons/gi'
import DOMPurify from 'dompurify';

export default function Hospital() {
    const [listing, setListing] =useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)

    
   const params = useParams()
    useEffect(()=>{
        async function fetchListing(){
            const docRef = doc(db, 'Hospitals', params.listingId);
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                setListing(docSnap.data())
                setLoading(false)

            }

        }
        fetchListing();
    }, [params.listingId])
  if(loading){
    return <Spinner/>
  }

  const content = listing.content
  function createMarkup(html){
    return {
      __html: DOMPurify.sanitize(html)
    }
  }

  return <main>
    <div className="w-full overflow-hidden h-[300px]"
    style={{background: `url(${listing.imgUrls}) center no-repeat`, backgroundSize: 'cover'}}>

    </div>
      <div className='fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400
      rounded-full w-12 h-12 flex justify-center items-center' onClick={()=>{
        navigator.clipboard.writeText(window.location.href)
        setShareLinkCopied(true)
        setTimeout(()=>{
          setShareLinkCopied(false)
        }, 2000)
      }}>
        < FaCopy className='text-lg text-slate-500'/>
      </div>
      {shareLinkCopied && (
        <p  className='fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2 '>Link Copied</p>
      )}
      <div className='flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5'>
        <div className=' h-[400px] w-full lg-[400px] '>
        <p className='text-2xl font-bold mb-1 text-blue-900 '>{listing.name}</p>
        <p className='flex items-center mt-2 mb-3 font-semibold'> <GiRotaryPhone className='text-green-700 mr-1'/>: {listing.PhoneNumber}</p>
        <p className='flex items-center mt-2 font-semibold'><FaMapMarkerAlt className='text-green-700 mr-1'/>: {listing.address},</p>
        <p className='flex items-center pl-7 font-semibold'>{listing.LGA},</p>
        <p className='flex items-center pl-7 font-semibold'>{listing.State}.</p>
        <p className='mt-2 mb-3' >
          <span className='font-semibold'>About Us: </span>
          <span dangerouslySetInnerHTML={createMarkup(content)}></span></p>
        </div>
        <div className='bg-blue-300 h-[200px] w-full lg-[400px] z-10 overflow-x-hidden'></div>
      </div>
  </main>
  
}
