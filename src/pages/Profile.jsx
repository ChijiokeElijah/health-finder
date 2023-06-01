import { useState } from 'react'
import {getAuth, updateProfile}from "firebase/auth" 
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { db } from '../firebase'
import {doc, updateDoc} from  'firebase/firestore'

export default function Profile() {
  const auth = getAuth()
  const navigate = useNavigate()
  const [changeDetail, setChangeDetail] = useState(false)
  const [formData, setFormData] = useState({
    name: "FMC Umuahia",
    email: "fmcumuahia@gmail.com",
  })
  const {name, email} = formData;
  function onLogOut(){
    auth.signOut()
    navigate("/")
  }
  
  function onChange(e){
    setFormData((prevState) =>({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  async function onSubmit(){
    try {
      if(auth.currentUser.displayName !== name){
        //update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        //update name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(docRef, {
          name,
        })
      }
      toast.success('Profile Details updated')
    } catch (error) {
      toast.error('Could not update the profile details')
      
    }
  }
  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'> 
      <h1 className='text-3xl text-center mt-6 font-bold'>My hospital Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3'>
        <form>
          <input 
          type='text' 
          id='name' 
          value={name} 
          disabled={!changeDetail} 
          onChange={onChange} 
          className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded 
          transition ease-in-out mb-6 ${changeDetail && 'bg-green-200 focus:bg-green-200'}`}/>
          <input type='email' id='email' value={email} disabled className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded 
          transition ease-in-out mb-6'/>

          <div className=' mb-6 flex justify-between whitespace-nowrap text-sm sm:text-lg'>
            <p className='flex items-center '>Do you want to change your name?
              <span className='text-red-600 hover:text-red-700 transition  ease-in-out duration-200 ml-1 
              cursor-pointer' onClick={() =>
              {changeDetail && onSubmit();
              setChangeDetail((prevState) => !prevState)}}>
                {changeDetail ? "Apply change" : "Edit"}</span>
            </p>
            <p onClick={onLogOut} className='text-blue-600 hover:text-blue-800 cursor-pointer transition ease-in-out duration-200'>Sign Out</p>
          </div>
        </form>
      </div>
      </section>
    </>
  )
}
