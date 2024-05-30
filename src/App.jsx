import { Routes, Route } from "react-router-dom";
import './App.css'
import Login from './components/authentification/login'
import Dashboard from './components/dashboard/Dashboard';
import FicheDePaie from './components/vues/FicheDePaie';
import Page404 from './components/vues/Page404';
import Facture from './components/vues/Facture';

function App() {

  return (
    <>      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/WorkTimeReact" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fiche-de-paie" element={<FicheDePaie />}></Route>
        <Route path="/dashboard/facture" element={<Facture />}></Route>
        <Route path="*" element={<Page404/>}/>
      </Routes>
    </>
  )
}

export default App
