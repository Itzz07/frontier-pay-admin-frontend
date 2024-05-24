import React from "react";

function AddRecordForm({ newRecordData, setNewRecordData, handleAddOrUpdateRecord }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecordData({ ...newRecordData, [name]: value });
  };

  return (
    <form onSubmit={handleAddOrUpdateRecord}>
      <div className="flex flex-col space-y-2">
        <input
          type="number"
          name="expectedAmount"
          value={newRecordData.expectedAmount}
          onChange={handleChange}
          placeholder="Expected Amount"
          className="border border-gray-300 px-4 py-2"
        />
        <input
          type="number"
          name="collectedAmount"
          value={newRecordData.collectedAmount}
          onChange={handleChange}
          placeholder="Collected Amount"
          className="border border-gray-300 px-4 py-2"
        />
        <input
          type="text"
          name="status"
          value={newRecordData.status}
          onChange={handleChange}
          placeholder="Status"
          className="border border-gray-300 px-4 py-2"
        />
        <input
          type="date"
          name="collectionDate"
          value={newRecordData.collectionDate}
          onChange={handleChange}
          placeholder="Collection Date"
          className="border border-gray-300 px-4 py-2"
        />
        <button type="submit" className="bg-[#3d5fc4] text-white rounded-md text-base py-2 px-4 font-bold">
          Add Record
        </button>
      </div>
    </form>
  );
}

export default AddRecordForm;
