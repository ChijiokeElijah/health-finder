import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { CSVLink } from "react-csv";

export default function FindHospital() {
  const [hospitalListings, setHospitalListing] = useState(null);
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(true);


  let listings = [];
  const exportData = [];

  useEffect(() => {
    async function fetchHospitalListing() {
      try {
        const listingRef = collection(db, "Hospitals");
        const q = query(
          listingRef,
          where("State", "==", state),
          orderBy("timestamp", "desc")
        );
        const querySnap = await getDocs(q);

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setHospitalListing(listings);

        querySnap.forEach((doc) => {
          return exportData.push({
            // id: doc.id,
            Name: doc.data().name,
            Address: doc.data().address,
            Email: doc.data().email,
            PhoneNumber: doc.data().PhoneNumber,
            LGA: doc.data().LGA,
            State: doc.data().State,
          });
        });
        
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }
    fetchHospitalListing();
  }, [state, listings, exportData]);

  function onChange(e) {
    setState(e.target.value.toUpperCase());
  }

  const headers = [
    { label: "Name", key: "name" },
    { label: "Address", key: "address" },
    { label: "Email", key: "email" },
    { label: "PhoneNumber", key: "PhoneNumber" },
    { label: "LGA", key: "LGA" },
    { label: "State", key: "State" },
  ];

  // const csvReport = {
  //   data: exportData,
  //   headers: headers,
  //   filename: "Hospital.csv",
  // };

  if (loading) {
    <Spinner />;
  }
  return (
    <div className="max-w-[1000px] mx-auto flex flex-col justify-center w-full h-[500px] p-4">
      <h2 className="lg:text-4xl text-2xl text-[#08299B] font-semibold">
        Find Hospital
      </h2>
      <input
        type="text"
        id="state"
        value={state}
        onChange={onChange}
        placeholder="Enter your State"
        className="border border-gray-400 "
      />
      {hospitalListings && hospitalListings.length > 0 && (
        <div className="max-w-6xl mx-auto pt-4 space-y-6">
          <h2 className="text-2xl mt-6 font-semibold"> Hospitals in {state}</h2>
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
            {hospitalListings.map((listing) => (
              <ListingItem
                key={listing.id}
                listing={listing.data}
                id={listing.id}
              />
            ))}
          </ul>
        </div>
      )}
      {/* <button onClick={() => console.log(exportData)}>BUTTON</button> */}
      {hospitalListings && hospitalListings.length > 0 && (
        <CSVLink className="hover:cursor-pointer bg-[#08299B] p-2 m-6  text-center text-white rounded-md" data={exportData} filename="hosp" headers={headers}>
         Export Hospitals
       </CSVLink>

      )}
      
      
    </div>
  );
}
