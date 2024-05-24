import React, { useState, useEffect } from "react";
import { collection, doc, deleteDoc, setDoc, updateDoc, getDoc, addDoc } from "firebase/firestore";
import Swal from 'sweetalert2'; 
import firebase from "../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import AddClientForm from "../components/AddClientForm";
import EditClientForm from "../components/EditClientForm";
import TableComponent from "../components/TableComponent";
import PaginationComponent from "../components/PaginationComponent";

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

  useEffect(() => {
    let unsubscribeCollection;
  
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName);
  
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
      setSearchQuery(""); // Clear search query on unmount
    };
  }, []);

  const filteredData = tableData.filter((item) =>
  item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
);


  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

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
          expectedAmount: clientToEdit.expectedAmount,
          collectedAmount: clientToEdit.collectedAmount,
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
      expectedAmount: "",
      collectedAmount: "",
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
          icon: 'success',
          title: 'Success',
          text: 'Client updated successfully!'
        });
      } else {
        const newDocRef = await addDoc(collection(db, "clients"), newClientData);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Client added successfully!'
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
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    }
  };

  const handleDeleteClient = async (docId) => {
    try {
      if (!tableData || !docId) {
        console.error("Error deleting client: tableData or docId is undefined.");
        return;
      }

      const index = tableData.findIndex((client) => client.id === docId);
      if (index === -1) {
        console.error("Error deleting client: client not found in tableData");
        return;
      }

      await deleteDoc(doc(db, "clients", docId));
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Client deleted successfully!'
      });
    } catch (error) {
      console.error("Error deleting client:", error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
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
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      window.location.href = "/login"; 
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Logout Error",
      });
    }
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="flex justify-between items-center w-full px-6 h-20 bg-[#00000012]">
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
            <div className="flex justify-center items-center space-x-4">
              <span className="text-white text-xl">{userName}</span>
              <button
                onClick={handleLogout}
                className="bg-white px-4 py-2 w-auto rounded-lg text-base uppercase font-semibold text-[#4f7cff]"
              >
                Logout
              </button>
            </div>
          )}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name"
              className="border border-gray-300 rounded-md py-1 px-2"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 px-3 py-1 bg-gray-200 text-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
  
      <div className="w-9/12 mx-auto mt-8">
        <Link to="/add-client" className="bg-[#3d5fc4] text-white rounded-md text-base py-2 px-4 font-bold">
          Add Client
        </Link>
      </div>
  
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
  {console.log("tableData:", tableData)
}
      <div className="w-full flex-grow">
      <TableComponent
  tableData={searchQuery ? filteredData : tableData} // Pass filteredData if searchQuery is present
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
    </>
  );
}

export default CollectionTable;
