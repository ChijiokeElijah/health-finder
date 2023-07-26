import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { EditorState } from "draft-js";
import {Editor} from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import '../App.css'
import { db } from "../firebase";
import { serverTimestamp, addDoc, collection } from "firebase/firestore";
// import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
// import {v4 as uuidv4} from "uuid";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
// import { CiImageOn } from "react-icons/ci";
import {convertToHTML} from 'draft-convert';
import { useNavigate } from "react-router";


export default function MyEditor() {
  const navigate = useNavigate()
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(false)
  const [editorState, setEditorState] = useState(
  () => EditorState.createEmpty(),
  );
  
  const [convertedContent, setConvertedContent] =useState(null)

  useEffect(() =>{
    let html = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(html)
  }, [editorState])

  

  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    LGA: "",
    State: "",
    PhoneNumber: "",
    latitude: 0,
    longitude:0
    
  });
  const { name, address, email, latitude, longitude, State, PhoneNumber, LGA} = formData;

  function onChange(e) {
    
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value.toUpperCase(),
        
      }));  
    }
    

  }
  
  
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    
    let geolocation ={}
    let location 
    if(geoLocationEnabled){
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`)
      const data = await response.json();
      console.log(data);
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO-RESULTS" && undefined;

      if(location === undefined || location.includes("undefined")){
        loading(false)
        toast.error('Please enter a current address');
        return;
      }
      toast.success("Yeah!")  
    }else{
      geolocation.lat = latitude;
      geolocation.lng = longitude
    }

    
    const formDataCopy = {
      ...formData,
      geolocation,
      content: convertedContent,
     timestamp: serverTimestamp(),
    userRef: auth.currentUser.uid,
    };

    
    const docRef = await addDoc(collection(db, "Hospitals"), formDataCopy);
    setLoading(false);
    toast.success("Hospital Created");
    navigate("/profile")
  }
  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
      <h1 className="text-3xl text-center mt-6 font-bold ">
        Create a Hospital
      </h1>
      <div className="w-full md:w-[50%] mt-6 px-3">
        <form method="post" onSubmit={onSubmit}>
          <input
            type="text"
            id="name"
            value={name}
            onChange={onChange}
            placeholder="Name of Hospital"
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white  border-gray-300 rounded transition ease-in-out mb-6"
          />
          <input
            type="text"
            id="email"
            value={email}
            onChange={onChange}
            placeholder="Email Address"
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white  border-gray-300 rounded transition ease-in-out mb-6"
          />
          <input
            id="PhoneNumber"
            value={PhoneNumber}
            type="text"
            onChange={onChange}
            placeholder="Phone Number"
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white  border-gray-300 rounded transition ease-in-out mb-6"
          />
          <input
            id="address"
            value={address}
            maxLength={35}
            onChange={onChange}
            type="text"
            placeholder="Address"
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white  !border-gray-300 rounded transition ease-in-out mb-6"
          />
          {!geoLocationEnabled && (
            <div className="flex space-x-6 justify-start mb-6">
              <div>
                <p className='text-gray-600'>Latitude</p>
                <input type="number" name="latitude" id="latitude" value={latitude} onChange={onChange} required  placeholder="latitude"
                 className="w-full px-4 py-2 text-xl
                text-gray-700 bg-white border border-gray-300 rounded
                transition duration-150 ease-in-out
               focus:text-gray-700 focus:bg-white
                focus:border-slate-600 text-center"/>
              </div>
              <div>
              <p className='text-gray-600'>Longitude</p>
                <input type="number" name="longitude" id="longitude" value={longitude} onChange={onChange} required placeholder="longitude"
                 className="w-full px-4 py-2 text-xl
                text-gray-700 bg-white border border-gray-300 rounded
                transition duration-150 ease-in-out
               focus:text-gray-700 focus:bg-white
                focus:border-slate-600 text-center"/>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-0 gap-2">
            <input
              type="text"
              id="LGA"
              value={LGA}
              onChange={onChange}
              placeholder="LGA"
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white  border-gray-300 rounded transition ease-in-out mb-6"
            />
            <input
              id="State"
              value={State}
              type="text"
              onChange={onChange}
              placeholder="State"
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white  border-gray-300 rounded transition ease-in-out mb-6"
            />
          </div>
          <h2 className='text-gray-600'>Add Hospital Description</h2>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
           />
          <div className="w-full flex">
            <button
              type="submit"
              className=" w-full bg-[#08299B] text-white uppercase px-7 py-3 mt-6 text-sm font-medium rounded shadow-md hover:bg-[#80bfff] transition duration-150 ease-in-out hover:shadow-lg active:bg-[#80bfff] flex justify-center items-center mb-6"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
