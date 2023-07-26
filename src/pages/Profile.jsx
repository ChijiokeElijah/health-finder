import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { collection, deleteDoc, doc, getDocs, orderBy, query,  where } from "firebase/firestore";
import { MdLocalHospital } from "react-icons/md";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import ListingItem from "../components/ListingItem";

export default function Profile() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();
  // const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const {  email } = formData;
  
  useEffect(()=>{
    async function fetchUserListing(){
      const listingRef = collection(db, "Hospitals");
      const q = query(listingRef, where("userRef", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc"));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc)=>{
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      });
      setListings(listings)
      setFormData({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
      })

      setLoading(false);
    }
    fetchUserListing();
  }, [auth.currentUser.uid, auth.currentUser.email, auth.currentUser.displayName ])
  async function onDelete(listingID){
    if(window.confirm("Are you sure you want to delete?")){
      await deleteDoc(doc(db, 'Hospitals', listingID))
      const updatedListings = listings.filter(
        (listing) => listings.id !== listingID
      )
      setListings(updatedListings)
      toast.success("Hospital Deleted Successfully")
    }
  }
  function onEdit(listingID){
    navigate(`/edit-listing/${listingID}`)

  }
  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">
          Welcome! <span className=" text-[#08299B]">{email}</span>
        </h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
                    <Link to="/create-hospital"> 
            <button type="submit" className="w-full bg-[#08299B] text-white uppercase px-7 py-3
            text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150
            ease-in-out hover:shadow-lg flex justify-center items-center">
              <MdLocalHospital className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2" />
              Add your health facility
            </button>
          </Link>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading  && listings.length > 0 && (
          <>
          <h2 className="text-2xl text-center font-semibold">My Hospitals</h2>
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
            {listings.map((listing)=>(
              <ListingItem key={listing.id} id={listing.id} listing={listing.data} onDelete={()=>onDelete(listing.id)}
              onEdit={()=>onEdit(listing.id)}/>
            ))}
          </ul>
          </>
        )}
      </div>
    </>
  );
}
