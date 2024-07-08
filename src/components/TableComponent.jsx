import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const TableComponent = ({ tableData, currentEntries, isLoading, handleEditClient, handleDeleteClient, handleShowRepaymentSummary }) => {
  const [summaryData, setSummaryData] = useState({});

  useEffect(() => {
    const fetchSummaryData = async () => {
      const db = getFirestore();
      const summaries = await Promise.all(
        currentEntries.map(async (row) => {
          const q = query(collection(db, `clients/${row.id}/repaymentSummary`));
          const querySnapshot = await getDocs(q);
          let expectedAmountSum = 0;
          let collectedAmountSum = 0;
          querySnapshot.forEach((doc) => {
            const summary = doc.data();
            console.log("Summary:", summary);
            // Parse strings to numbers before summing up
            const expectedAmount = parseFloat(summary.expectedAmount);
            const collectedAmount = parseFloat(summary.collectedAmount);
            if (!isNaN(expectedAmount)) {
              expectedAmountSum += expectedAmount;
            }
            if (!isNaN(collectedAmount)) {
              collectedAmountSum += collectedAmount;
            }          
          });
          return { id: row.id, expectedAmountSum, collectedAmountSum };
        })
      );
      const summaryMap = {};
      summaries.forEach((summary) => {
        summaryMap[summary.id] = summary;
      });
      setSummaryData(summaryMap);
    };

    if (!isLoading) {
      fetchSummaryData();
    }
  }, [currentEntries, isLoading]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="flex flex-col items-center w-full mx-auto mt-8 backdrop-blur-md drop-shadow-xl shadow-black  rounded-3xl">
      <div className="w-full flex justify-center flex-grow"> {/* Utilize flex-grow to take available space */}
        <table className="w-full border-collapse bg-white rounded-3xl overflow">
          <thead>
            <tr>
              <th className=" px-1 py-2 font-bold text-xs text-gray-500">Duration</th>
              <th className=" px-1 py-2 font-bold text-xs text-gray-500">Collection Date</th>
              <th className=" px-1 py-2 font-bold text-xs text-gray-500">First Name</th>
              <th className=" px-1 py-2 font-bold text-xs text-gray-500">Surname</th>
              <th className=" px-1 py-2 font-bold text-xs text-gray-500">Sum Of Expected Amount</th>
              <th className=" px-1 py-2 font-bold text-xs text-gray-500">Sum Of Collected Amount</th>
              <th className=" px-1 py-2 font-bold text-xs text-gray-500">Email</th>
              <th className=" px-1 py-2 font-bold text-xs text-gray-500">Phone</th>
              <th className=" px-1 py-2 font-bold text-xs text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? ( 
              <tr>
                <td colSpan="9" className="p-9 text-md font-bold text-gray-600" >Loading...</td>
              </tr>
            ) : (
              currentEntries.map((row) => (
                <tr key={row.id}>
                <td className="border-t-2 border-gray-200 p-2">
                  {row.from && row.to ? `${formatDate(row.from)} - ${formatDate(row.to)}` : ""}
                </td>
                <td className="border-t-2 border-gray-200 p-2">
                  {row.collectionDate ? row.collectionDate : ""}
                </td>
                  <td className=" border-t-2 border-gray-200 p-2">{row.firstName}</td>
                  <td className=" border-t-2 border-gray-200 p-2">{row.surName}</td>
                  <td className=" border-t-2 border-gray-200 p-2">{summaryData[row.id] ? summaryData[row.id].expectedAmountSum : 0}</td>
                  <td className=" border-t-2 border-gray-200 p-2">{summaryData[row.id] ? summaryData[row.id].collectedAmountSum : 0}</td>
                  <td className=" border-t-2 border-gray-200 p-2">{row.email}</td>
                  <td className=" border-t-2 border-gray-200 p-2">{row.phone}</td>
                  <td className=" border-t-2 border-gray-200 p-2 flex justify-center items-center"> {/* Flex container */}
                  <button
                    onClick={() => handleEditClient(row.id)}
                    className="text-gray-500 rounded-md text-base p-1 font-bold mr-2 hover:bg-blue-500 hover:text-white transition delay-150 duration-150 ease-in-out"
                    title="Edit Client"
                  >
                    <span class="material-symbols-outlined">
                      edit
                    </span>
                  </button>

                  <button
                    onClick={() => handleShowRepaymentSummary(row.id)}
                    className="text-gray-500 rounded-md text-base p-1 font-bold mr-2 hover:bg-green-500 hover:text-white transition delay-150 duration-150 ease-in-out"
                    title="Show Repayment Summary"
                  >
                    <span class="material-symbols-outlined">
                      monitoring
                    </span>
                  </button>

                  <button
                    onClick={() => handleDeleteClient(row.id)}
                    className="text-gray-500 rounded-md text-base p-1 font-bold mr-2 hover:bg-red-500 hover:text-white transition delay-150 duration-150 ease-in-out"
                    title="Delete Client"
                  >
                    <span class="material-symbols-outlined">
                      delete_forever
                    </span>
                  </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableComponent;
