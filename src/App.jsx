import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './components/login'
import Dashboard from './components/Dashboard';
import FicheDePaie from './components/FicheDePaie';
import Page404 from './components/Page404';
import Facture from './components/Facture';

function App() {

  return (
    <>      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fiche-de-paie" element={<FicheDePaie />}></Route>
        <Route path="/dashboard/facture" element={<Facture />}></Route>
        <Route path="*" element={<Page404/>}/>
      </Routes>
    </>
  )
}

export default App
