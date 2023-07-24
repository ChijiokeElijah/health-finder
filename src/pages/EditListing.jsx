import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Spinner from "../components/Spinner";
import { EditorState } from "draft-js";
import {Editor} from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import '../App.css'
import { db } from "../firebase";
import { serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
// import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
// import {v4 as uuidv4} from "uuid";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
// import { CiImageOn } from "react-icons/ci";
import {convertToHTML} from 'draft-convert'
import { useParams } from "react-router";

export default function EditListing() {
    const navigate = useNavigate()
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
  const [listing, setListing] = useState(null);
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
  

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    LGA: "",
    State: "",
    PhoneNumber: "",
    // images: {},
    latitude: 0,
    longitude:0,
    
  });
  const { name, address, email, State, PhoneNumber, LGA, latitude, longitude } = formData;
 const params = useParams()

 useEffect(()=>{
    if(listing && listing.userRef !== auth.currentUser.uid){
        toast.error("You cannot edit this Hospital");
        navigate("/");
    }
}, [auth.currentUser.uid, listing, navigate])


useEffect(()=>{
    setLoading(true)
    async function fetchListing(){
        const docRef = doc(db, "Hospitals", params.listingId)
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            setListing(docSnap.data());
            setFormData({...docSnap.data()})
            setLoading(false)
        }else{
            navigate("/");
            toast.error("Listing does not exist")
        }
    }
    fetchListing();

}, [params.listingId, navigate]);
 

  function onChange(e) {
    // if(e.target.files){
    //   setFormData((prevState)=>({
    //     ...prevState,
    //     images: e.target.files
    //   }))
    // }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
        
      }));  
    }
    

  }
  
  
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // if(images.length < 1){
    //   setLoading(false);
    //   toast.error("Add an image")
    //   return;
    // }

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

//     async function storeImage(image){
//       return new Promise((resolve, reject) =>{
//         const storage = getStorage()
//         const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
//         const storageRef = ref(storage, filename );
//         const uploadTask = uploadBytesResumable(storageRef, image);
//         uploadTask.on('state_changed', 
//   (snapshot) => {
//     // Observe state change events such as progress, pause, and resume
//     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//     console.log('Upload is ' + progress + '% done');
//     switch (snapshot.state) {
//       case 'paused':
//         console.log('Upload is paused');
//         break;
//       case 'running':
//         console.log('Upload is running');
//         break;
//     }
//   }, 
//   (error) => {
//     // Handle unsuccessful uploads
//     reject(error)
//   }, 
//   () => {
//     // Handle successful uploads on complete
//     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//       resolve(downloadURL);
//     });
//   }
// );
//       })
//     }

//     const imgUrls = await Promise.all(
//     [...images].map((image) =>storeImage(image))).catch((error)=>{
//       setLoading(false)
//       toast.error("images not uploaded")
//       return
//     });

    
    const formDataCopy = {
      ...formData,
      // imgUrls, 
      geolocation,
      content: convertedContent,
     timestamp: serverTimestamp(),
    userRef: auth.currentUser.uid,
    };

    // delete formDataCopy.images;
    // delete formDataCopy.latitude;
    // delete formDataCopy.longitude
    const docRef = doc(db, "Hospitals", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Hospital Edited");
  }
  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
      <h1 className="text-3xl text-center mt-6 font-bold ">
        Edit a Hospital
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
            onChange={onChange}
            type="text"
            placeholder="Address"
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white  !border-gray-300 rounded transition ease-in-out mb-6"
          />
          {!geoLocationEnabled && (
            <div className="flex space-x-6 justify-start mb-6">
              <div>
                <input type="" name="" id="latitude" value={latitude} onChange={onChange} required  placeholder="latitude"
                 className="w-full px-4 py-2 text-xl
                text-gray-700 bg-white border border-gray-300 rounded
                transition duration-150 ease-in-out
               focus:text-gray-700 focus:bg-white
                focus:border-slate-600 text-center"/>
              </div>
              <div>
                <input type="" name="" id="longitude" value={longitude} onChange={onChange} required placeholder="longitude"
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
          <h2>Add Hospital Description</h2>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
           />
          <div className="w-full flex">
            {/* <input
              accept=".jpg, .png, .jpeg "
              id="images"
              type="file"
              name="images"
              onChange={onChange}
              style={{ display: "none" }}
              required
            />
            <label htmlFor="images">
              <div
                color="primary"
                aria-label="upload picture"
                component="span"
                
              >
                <CiImageOn className="mr-2 text-6xl rounded-full p-1 border-2"/>
              </div>
            </label> */}

            <button
              type="submit"
              className="w-full bg-[#08299B] text-white uppercase px-7 py-3 mt-6 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-[#80bfff] flex justify-center items-center mb-6"
            >
             Edit Post
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
