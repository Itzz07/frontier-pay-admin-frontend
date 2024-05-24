// PaginationComponent.jsx
import React from "react";

const PaginationComponent = ({ currentPage, paginate, totalEntries, entriesPerPage }) => (
  <ul className="flex justify-center items-center mt-4">
    {Array.from({ length: Math.ceil(totalEntries / entriesPerPage) }, (_, i) => i + 1).map((number) => (
      <li key={number}>
        <button
          onClick={() => paginate(number)}
          className={`${currentPage === number ? 'bg-gray-300' : 'bg-white'} border border-gray-300 px-4 py-2 mx-1 rounded`}
        >
          {number}
        </button>
      </li>
    ))}
  </ul>
);

export default PaginationComponent;
