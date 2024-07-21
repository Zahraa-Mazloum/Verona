import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import Login from "../src/pages/login/login";
import RequireAuth from './components/RequireAuth';
import Profile from './pages/profile/profile';
import Dashboard from './pages/dashboard/dashboard';
import useDocumentTitle from './hooks/useDocumentTitle';
import CurrencyTable from './components/currency/CurrencyTable';
import EditCurrency from './components/currency/EditCurrency';
import AddCurrency from './components/currency/AddCurrency';
import Contract from './components/contracts/contractTable';
import Investor from './components/investors/investorTable';
import ViewInvestor from './components/investors/viewInvestor';
import AddInvestor from './components/investors/AddInvestor';
import AddContract from './components/contracts/addContracts';
import EditContracts  from './components/contracts/editContracts';
import Types from './components/investmentTypes/investmentTypes';
import AddTypes from './components/investmentTypes/addInvestmentTypes';
import EditTypes from './components/investmentTypes/editInvestmentTypes';
import Investment from './components/investment/investmentTable';
import AddInvestment from './components/investment/AddInvestments';
import EditInv from './components/investment/editinvestment';
import OverallInv from './components/overallInv.js'
import NewInvestments from './components/newInv/newInv.js'
import WalletTable from './components/wallets/walletTable.js'
import AddWallet from './components/wallets/addWallets.js';
import UpdateUser from './components/investors/EditInvestorInfo.js';
import EditWallet from './components/wallets/EditWallet.js';
import Loading from './components/loading.js';
import RegisterInvestor from './components/RegisterInvestor.js';
import InvDashboard from './pages/InvDashboard/InvDashboard.js'
import InvContracts from './components/InvContracts/invContractTable.js';
import InvestorInv from './components/investorsINv/investorInv.js'


import './App.css'

function App() {
  useDocumentTitle();
  const userRole = localStorage.getItem('role');

  let routes;
  if (userRole === 'admin') {
    routes = (
      <Route path="/" element={<RequireAuth />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="CurrencyTable" element={<CurrencyTable />} />
        <Route path="Contract" element={<Contract />} />
        <Route path="Investor" element={<Investor />} />
        <Route path="Types" element={<Types />} />
        <Route path="overallInv" element={<OverallInv />} />
        <Route path="NewInvestments" element={<NewInvestments />} />
        <Route path="wallets" element={<WalletTable />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/editCurrency/:id" element={<EditCurrency />} />
        <Route path="/updateUser/:id" element={<UpdateUser />} />
        <Route path="/addCurrency" element={<AddCurrency />} />
        <Route path="/viewInvestor/:id" element={<ViewInvestor />} />
        <Route path="/addinvestor" element={<AddInvestor   />} />
        <Route path="/addWallet" element={<AddWallet   />} />
        <Route path="/addContracts" element={<AddContract   />} />
        <Route path="/addinvestmentTypes" element={<AddTypes   />} />
        <Route path="/addinvestment" element={<AddInvestment   />} />
        <Route path="/editContracts/:id" element={<EditContracts    />} />
        <Route path="/editinvestmentTypes/:id" element={<EditTypes    />} />
        <Route path="/editinvestment/:id" element={<EditInv />} />
        <Route path="/editWallet/:id" element={<EditWallet />} />
      </Route>
    );
  } else if (userRole === 'investor') {
    routes = (
      <Route path="/" element={<RequireAuth />}>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="Profile" element={<Profile />} />
      <Route path="Dashboard" element={<InvDashboard />} />
      <Route path="/investorContracts/:id" element={<InvContracts />} />
      <Route path="/investment" element={<Investment />} />
      <Route path="/myInvestments/:id" element={<InvestorInv />} />
      <Route path="overallInv" element={<OverallInv />} />

      </Route>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterInvestor />} />
        
        {/* protected routes */}
        {routes}
      </Routes>
    </Suspense>
  );
}

export default App;