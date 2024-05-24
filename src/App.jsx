import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import CollectionTable from './pages/collectionTable';
import EditClientForm from "./components/EditClientForm";
import RepaymentSummaryTable from './pages/repaymentSummaryTable';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CollectionTable />} />
          <Route path="/RepaymentSummaryTable/:docId" element={<RepaymentSummaryTable />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit-client/:clientId" element={<EditClientForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
