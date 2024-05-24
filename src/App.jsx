import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './components/login'
import Dashboard from './components/Dashboard';
import FicheDePaie from './components/FicheDePaie';

function App() {

  return (
    <>      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fiche-de-paie" element={<FicheDePaie />}></Route>
      </Routes>
    </>
  )
}

export default App
