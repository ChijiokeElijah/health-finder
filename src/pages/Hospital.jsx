import React from 'react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { db } from "../firebase";
import {doc, getDoc} from 'firebase/firestore'
import Spinner from "../components/Spinner";
import {FaCopy} from "react-icons/fa"

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
  </main>
  
}
