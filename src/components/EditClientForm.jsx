import React from "react";

function EditClientForm({
  newClientData,
  setNewClientData,
  handleAddOrUpdateClient,
  handleCancelEdit,
  isEditing, // Add isEditing as a prop
}) {
  
  return (
    <form
      onSubmit={(e) => handleAddOrUpdateClient(e)}
      className="bg-white p-8 rounded-md shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6">
        {isEditing ? "Edit Client" : "Add New Client"}
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 text-gray-800">First Name</label>
          <input
            type="text"
            value={newClientData.firstName}
            onChange={(e) =>
              setNewClientData({
                ...newClientData,
                firstName: e.target.value,
              })
            }
            className="border border-gray-300 px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-gray-800">Surname</label>
          <input
            type="text"
            value={newClientData.surName}
            onChange={(e) =>
              setNewClientData({ ...newClientData, surName: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 w-full"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 text-gray-800 ">Email</label>
          <input
            type="email"
            value={newClientData.email}
            onChange={(e) =>
              setNewClientData({ ...newClientData, email: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-gray-800">Phone</label>
          <input
            type="text"
            value={newClientData.phone}
            onChange={(e) =>
              setNewClientData({ ...newClientData, phone: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 w-full"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 text-gray-800">Collection Date</label>
          <input
            type="date"
            name="collectionDate"
            value={newClientData.collectionDate}
            onChange={(e) =>
              setNewClientData({
                ...newClientData,
                collectionDate: e.target.value,
              })
            }
            placeholder="Collection Date"
            className="border border-gray-300 px-4 py-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-2 text-gray-800">Duration</label>
          <div className="flex space-x-4">
            <input
              type="date"
              value={newClientData.from}
              onChange={(e) =>
                setNewClientData({
                  ...newClientData,
                  from: e.target.value,
                })
              }
              className="border border-gray-300 px-4 py-2 w-full"
              required
            />
            <p className="text-lg">To</p>
            <input
              type="date"
              value={newClientData.to}
              onChange={(e) =>
                setNewClientData({
                  ...newClientData,
                  to: e.target.value,
                })
              }
              className="border border-gray-300 px-4 py-2 w-full"
              required
            />
          </div>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-[#3d5fc4] text-white rounded-md text-base py-2 px-4 font-bold mr-2"
        >
          {isEditing ? "Update" : "Add"}
        </button>
        <button
          type="button"
          onClick={handleCancelEdit}
          className="bg-gray-400 text-white rounded-md text-base py-2 px-4 font-bold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditClientForm;
