// ClientRow.jsx
import React from "react";

const ClientRow = ({ row, handleEditClient, handleDeleteClient, handleShowRepaymentSummary }) => (
  <tr>
    <td className="border border-gray-300 px-4 py-2">{row.collectionDate}</td>
    <td className="border border-gray-300 px-4 py-2">{row.firstName}</td>
    <td className="border border-gray-300 px-4 py-2">{row.surName}</td>
    <td className="border border-gray-300 px-4 py-2">{row.expectedAmount}</td>
    <td className="border border-gray-300 px-4 py-2">{row.collectedAmount}</td>
    <td className="border border-gray-300 px-4 py-2">{row.status}</td>
    <td className="border border-gray-300 px-4 py-2">{row.email}</td>
    <td className="border border-gray-300 px-4 py-2">{row.phone}</td>
    <td className="border border-gray-300 px-4 py-2">
      <button
        onClick={() => handleEditClient(row.id)}
        className="bg-[#3d5fc4] text-white rounded-md text-base py-1 px-2 font-bold mr-2"
      >
        Edit
      </button>
      <button
        onClick={() => handleDeleteClient(row.id)}
        className="bg-red-500 text-white rounded-md text-base py-1 px-2 font-bold mr-2"
      >
        Delete
      </button>
      <button
        onClick={() => handleShowRepaymentSummary(row.id)}
        className="bg-[#4caf50] text-white rounded-md text-base py-1 px-2 font-bold my-2"
      >
        Repayment Summary
      </button>
    </td>
  </tr>
);

export default ClientRow;
