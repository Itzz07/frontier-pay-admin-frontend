import React from "react";
import { collection, doc, deleteDoc, setDoc, updateDoc, getFirestore, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'; 
import AddRecordForm from "../components/AddRecordForm";
import EditRecordForm from "../components/EditRecordForm";
import firebase from "../firebase/firebaseConfig";
import { useParams,  useNavigate  } from "react-router-dom";

function RepaymentSummaryTable() {
  const { docId } = useParams();
  const [tableData, setTableData] = useState([]);
  const [newRecordData, setNewRecordData] = useState({
    expectedAmount: "",
    collectedAmount: "",
    status: "",
    collectionDate: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  const db = getFirestore();

  useEffect(() => {
    if (docId) {
      const clientRef = doc(db, "clients", docId);
      const summaryRef = collection(clientRef, "repaymentSummary");

      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          const fetchData = async () => {
            try {
              const snapshot = await getDocs(summaryRef);
              const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              data.sort((a,b) => b.timeStamp - a.timeStamp); //sort daat in descending order based on the timestamp
              setTableData(data);
              setIsLoading(false); // Data loaded, set isLoading to false
            } catch (error) {
              console.error("Error fetching data:", error.message);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message,
              });
            }
          };

          fetchData();
        } else {
          navigate(`/login`);
        }
      });

      return () => {
        unsubscribe();
      };
    } 
  }, [docId, db]);

  const handleEditRecord = (summaryId) => {
    const summaryToEdit = tableData.find((summary) => summary.id === summaryId);

    setNewRecordData({
      expectedAmount: summaryToEdit.expectedAmount,
      collectedAmount: summaryToEdit.collectedAmount,
      status: summaryToEdit.status,
      collectionDate: summaryToEdit.collectionDate,
    });

    setEditingRecordId(summaryId);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setNewRecordData({
      expectedAmount: "",
      collectedAmount: "",
      status: "",
      collectionDate: "",
    });

    setEditingRecordId(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleDeleteRecord = async (summaryId) => {
    try {
      const summaryRef = collection(doc(db, "clients", docId), "repaymentSummary");
      await deleteDoc(doc(summaryRef, summaryId));
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Record deleted successfully!'
      });
      // window.location.reload(); // Reload the page after dismissing the alert dialog
    } catch (error) {
      console.error("Error deleting record:", error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    }
  };

  const handleAddOrUpdateRecord = async (e) => {
    e.preventDefault();

    try {
      const summaryRef = collection(doc(db, "clients", docId), "repaymentSummary");


      const newRecordWithTimestamp = {
        ...newRecordData,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      };

      if (isEditing) {
        await updateDoc(doc(summaryRef, editingRecordId), newRecordWithTimestamp);
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Record updated successfully!'
        });
      } else {
        await setDoc(doc(summaryRef), newRecordWithTimestamp);
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Record added successfully!'
        });
      }

      setNewRecordData({
        expectedAmount: "",
        collectedAmount: "",
        status: "",
        collectionDate: "",
      });
      setIsEditing(false);
      setShowForm(false);
      window.location.reload(); // Reload the page after dismissing the alert dialog
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    }
  };

  const handleBack = () => {
    window.location.href = "/"; 
  };
  
  return (
    <>
      <div className="px-2 flex flex-col items-center w-11/12 mx-auto min-h-screen overflow-x-hidden backdrop-blur-lg">
        <div className="flex justify-between items-center w-full px-6 h-20 bg-[#09284483] rounded-b-lg">
          <div className="text-4xl font-bold text-white">Repayment Table</div>
          <button
            onClick={handleBack}
            className="material-symbols-outlined transition delay-150 duration-300 ease-in-out bg-white/80 hover:bg-white px-4 py-2 w-auto rounded-lg text-2xl uppercase font-bold text-[#4f7cff] relative"
            title="Back" // Tooltip text
          >
            arrow_back_ios
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-300 pointer-events-none">Back</span>
          </button>
        </div>
  

        <div className="w-9/12 mx-auto mt-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#3d5fc4] text-white rounded-md text-base py-2 px-4 font-bold"
          >
            {showForm ? "Close Form" : "Add Record"}
          </button>
        </div>

        {showForm && (
          <div className="w-9/12 mx-auto mt-4">
            {isEditing ? (
              <EditRecordForm
                newRecordData={newRecordData}
                setNewRecordData={setNewRecordData}
                handleAddOrUpdateRecord={handleAddOrUpdateRecord}
                handleCancelEdit={handleCancelEdit}
              />
            ) : (
              <AddRecordForm
                newRecordData={newRecordData}
                setNewRecordData={setNewRecordData}
                handleAddOrUpdateRecord={handleAddOrUpdateRecord}
              />
            )}
          </div>
        )}

        <div className="flex flex-col items-center w-12/12 mx-auto mt-8">
          {isLoading ? ( // Check if isLoading is true
            <div className="text-white">Loading...</div>
          ) : (
            <table className="w-full border-collapse bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">Date</th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">Expected Amount</th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">Collected Amount</th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">Pending Amount</th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">Status</th>
                  <th className="border border-gray-300 px-4 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((summary) => (
                  <tr key={summary.id}>
                    <td className="border border-gray-300 px-4 py-2">{summary.collectionDate}</td>
                    <td className="border border-gray-300 px-4 py-2">{summary.expectedAmount}</td>
                    <td className="border border-gray-300 px-4 py-2">{summary.collectedAmount}</td>
                    <td className="border border-gray-300 px-4 py-2">{summary.pendingAmount}</td>
                    <td className="border border-gray-300 px-4 py-2">{summary.status}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleEditRecord(summary.id)}
                        className="bg-[#3d5fc4] text-white rounded-md text-base py-1 px-2 font-bold mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(summary.id)}
                        className="bg-red-500 text-white rounded-md text-base py-1 px-2 font-bold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default RepaymentSummaryTable;