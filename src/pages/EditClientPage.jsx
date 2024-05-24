import React from "react";
import { useNavigate } from "react-router-dom";
import EditClientForm from "../components/EditClientForm"; // Import EditClientForm component
import firebase from "../firebase/firebaseConfig";

function EditClientPage() {
  const navigate = useNavigate();
  const [clientData, setClientData] = React.useState({
    firstName: "",
    surName: "",
    expectedAmount: "",
    collectedAmount: "",
    status: "",
    email: "",
    phone: "",
    collectionDate: "",
    from: "",
    to: "",
  });

  // Fetch client data from Firestore based on client ID or other criteria
  // This could be based on a route parameter or some other identifier
  // For this example, let's assume we have a client ID stored in state
  const clientId = "your_client_id_here";

  React.useEffect(() => {
    const fetchClientData = async () => {
      try {
        const db = firebase.firestore();
        const clientRef = await db.collection("clients").doc(clientId).get();
        const clientData = clientRef.data();
        setClientData(clientData);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchClientData();
  }, [clientId]);

  // Handler function for updating client data
  const handleUpdateClient = async (e) => {
    e.preventDefault();

    try {
      const db = firebase.firestore();
      await db.collection("clients").doc(clientId).update(clientData);

      // Redirect or perform other actions after updating client if needed
      navigate("/"); // Redirect back to CollectionTable page upon successfully updating client
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  return (
    <div className="w-9/12 mx-auto mt-4">
      <EditClientForm
        newClientData={clientData} // Pass client data as newClientData
        setNewClientData={setClientData} // Update function for client data
        handleAddOrUpdateClient={handleUpdateClient} // Pass the handler function for updating client
        isEditing={true} // Set isEditing to true for editing mode
      />
    </div>
  );
}

export default EditClientPage;
