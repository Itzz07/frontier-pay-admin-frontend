import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import firebase from "../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import EditClientForm from "../components/EditClientForm";
import TableComponent from "../components/TableComponent";
import PaginationComponent from "../components/PaginationComponent";
import SearchInput from "react-search-input";

import ClientRow from "../components/ClientRow";

function CollectionTable() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [newClientData, setNewClientData] = useState({
    firstName: "",
    surName: "",
    expectedAmount: "",
    collectedAmount: "",
    status: "",
    email: "",
    phone: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const db = firebase.firestore();
  // const clientsCollection = collection(db, "clients");

  useEffect(() => {
    let unsubscribeCollection;

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName);

        const db = firebase.firestore();
        const clientsCollection = db.collection("clients");

        unsubscribeCollection = clientsCollection.onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTableData(data);
          setIsLoading(false);
        });
      } else {
        navigate(`/login`);
        setUserId("");
        setUserName("");
      }
    });

    return () => {
      unsubscribe();
      if (unsubscribeCollection) {
        unsubscribeCollection();
      }
      setSearchQuery("");
    };
  }, []);

  const filteredData = tableData.filter(
    (item) =>
      (item.firstName &&
        item.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.surName &&
        item.surName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = tableData.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditClient = (clientId) => {
    if (tableData) {
      const clientToEdit = tableData.find((client) => client.id === clientId);

      if (clientToEdit) {
        setNewClientData({
          firstName: clientToEdit.firstName,
          surName: clientToEdit.surName,
          email: clientToEdit.email,
          phone: clientToEdit.phone,
          status: clientToEdit.status,
        });

        setEditingClientId(clientId);
        setIsEditing(true);
        setShowForm(true);
      } else {
        console.error(`Client with id ${clientId} not found in tableData.`);
      }
    } else {
      console.error("tableData is not available.");
    }
  };

  const handleCancelEdit = () => {
    setNewClientData({
      firstName: "",
      surName: "",
      status: "",
      email: "",
      phone: "",
    });

    setEditingClientId(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleAddOrUpdateClient = async (e) => {
    e.preventDefault();

    try {
      if (!newClientData || !Object.keys(newClientData).length) {
        console.error("New client data is empty.");
        return;
      }

      if (isEditing && editingClientId) {
        await updateDoc(doc(db, "clients", editingClientId), newClientData);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Client updated successfully!",
        });
      } else {
        const newDocRef = await addDoc(
          collection(db, "clients"),
          newClientData
        );
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Client added successfully!",
        });
        console.log("New client added with ID: ", newDocRef.id);
      }

      setNewClientData({
        firstName: "",
        surName: "",
        email: "",
        phone: "",
      });
      setIsEditing(false);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding/updating client:", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  const handleDeleteClient = async (docId) => {
    try {
      if (!tableData || !docId) {
        console.error(
          "Error deleting client: tableData or docId is undefined."
        );
        return;
      }

      const index = tableData.findIndex((client) => client.id === docId);
      if (index === -1) {
        console.error("Error deleting client: client not found in tableData");
        return;
      }

      await deleteDoc(doc(db, "clients", docId));
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Client deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting client:", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  const handleShowRepaymentSummary = async (docId) => {
    try {
      if (!docId) {
        console.error("Error showing repayment summary: docId is undefined.");
        return;
      }

      const clientRef = doc(db, "clients", docId);
      const docSnapshot = await getDoc(clientRef);

      if (docSnapshot.exists()) {
        navigate(`/RepaymentSummaryTable/${docId}`);
      } else {
        await setDoc(clientRef, {});
        navigate(`/RepaymentSummaryTable/${docId}`);
      }
    } catch (error) {
      console.error("Error showing repayment summary:", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      window.location.href = "https://frontierpaymentdashboard.netlify.app/login";
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Logout Error",
      });
    }
  };

  const handleSearch = (term) => {
    setSearchQuery(term);
  };

  return (
    <>
      <div className="px-2 flex flex-col items-center w-11/12 mx-auto min-h-screen overflow-x-hidden backdrop-blur-lg">
        {/* Navbar */}
        <div className="flex justify-between items-center w-full px-6 h-20 bg-[#09284483] rounded-b-2xl backdrop-blur-md drop-shadow-xl shadow-black">
          <div className="text-4xl font-bold text-white">Clients Table</div>
          <div className="flex justify-center items-center gap-2">
            {!userId ? (
              <a
                href="/login"
                className="bg-white px-4 py-2 uppercase w-auto rounded-lg text-xl text-[#4f7cff] font-semibold"
              >
                Login
              </a>
            ) : (
              <div className="flex justify-center items-center space-x-4 relative">
                <span className="text-white text-xl font-bold capitalize mr-5">
                  {userName}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                  }}
                  className="material-symbols-outlined transition delay-150 duration-300 ease-in-out bg-white/80 hover:bg-white  px-4 py-2 w-auto rounded-lg text-2xl uppercase font-bold text-[#4f7cff] relative"
                  title="Logout" // Tooltip text
                >
                  logout
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-300 pointer-events-none">
                    Logout
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ############ SEARCH INPUT ############ */}

        <div className="px-1 py-3 flex justify-center items-center w-full">
          <div className="relative w-full max-w-md mx-auto py-0 shadow-lg shadow-gray-300 rounded-lg">
            <label htmlFor="default-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <SearchInput
                id="default-search"
                style={{
                  height: "32px",
                  width: "80%",
                  outline: "none",
                  background: "rgb(249 250 251)",
                }}
                className="search-input block w-full p-2 pl-10 text-sm text-gray-900 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 shadow-gray-200 shadow-inner"
                onChange={handleSearch}
                placeholder="Search by name..."
                required
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                  }}
                  className="absolute right-3 bottom-2 bg-blue-700/60 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-white"
                >
                  Search
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Form for adding a new client */}
        {showForm && (
          <div className="w-9/12 mx-auto mt-4">
            {isEditing ? (
              <EditClientForm
                newClientData={newClientData}
                setNewClientData={setNewClientData}
                handleAddOrUpdateClient={handleAddOrUpdateClient}
                handleCancelEdit={handleCancelEdit}
                isEditing={isEditing}
              />
            ) : (
              <AddClientForm
                newClientData={newClientData}
                setNewClientData={setNewClientData}
                handleAddOrUpdateClient={handleAddOrUpdateClient}
              />
            )}
          </div>
        )}
        {/* {console.log("tableData:", tableData)} */}
        {console.log("tableData:", filteredData)}

        <div className="w-full flex-grow">
          {" "}
          {/* Utilize flex-grow to take available space */}
          <TableComponent
            tableData={searchQuery ? filteredData : tableData}
            currentEntries={currentEntries}
            isLoading={isLoading}
            handleEditClient={handleEditClient}
            handleDeleteClient={handleDeleteClient}
            handleShowRepaymentSummary={handleShowRepaymentSummary}
          />
        </div>

        <PaginationComponent
          currentPage={currentPage}
          paginate={paginate}
          totalEntries={tableData.length}
          entriesPerPage={entriesPerPage}
        />
      </div>
    </>
  );
}

export default CollectionTable;
