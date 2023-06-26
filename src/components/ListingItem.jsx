import React from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {FaTrash} from 'react-icons/fa'
import {MdEdit} from 'react-icons/md'
 
export default function ListingItem({listing, id, onDelete, onEdit}) {
  return (
    <li className="relative bg-white flex flex-col justify-betweem items-center 
    shadow-md hover:shadow-xl rounded-md overfole-hidden transition-shadow duration-150 m-[10px]">
        <Link to={`/${listing.name}/${id}`}>
            <img className='h-[170px] w-full object-cover
             hover:scale-105 transition-scale duration-200 ease-in'
             loading='lazy' src={listing.imgUrls} />
            <Moment className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs fonst-semibold
            rounded-md px-2 py-1 shadow-lg' fromNow>
                {listing.timestamp?.toDate()}
            </Moment>
            <div className='w-full p-[10px] '>
                <p className='font-semibold m-0 text-xl text-[#457b9d] '>{listing.name}</p>
                <div className='flex items-center space-x-1'>
                <MdLocationOn  className='h-4 w-4 text-green-600'/>
                <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate'>{listing.address}</p>
                </div>
                <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate'>{listing.LGA}</p>
                <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate'>{listing.State}</p>
            </div>
            
        </Link>
        {onDelete && (
          <FaTrash className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500" onClick={()=> onDelete((listing.id))}/>
          
        )}
        {onEdit && (
          <MdEdit className="absolute bottom-2 right-7 h-4 cursor-pointer" onClick={()=> onEdit((listing.id))}/>
          
        )}
    </li>
  )
}
