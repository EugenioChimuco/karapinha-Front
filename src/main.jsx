import React from 'react'
import Servicos from './components/Servicos/servicos.jsx';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter , Route, Routes } from "react-router-dom";
import Admin from './components/AdminD/admin.jsx';
import Manager from './components/ManagerP/manager.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter >
      <Routes>
        <Route path="/" Component = {App} />
        <Route path="/admin" Component = {Admin} />
        <Route path="/manager" Component = {Manager} />
        <Route path="/manager" Component = {Manager} />
        <Route path="/servicos" Component = {Servicos} />
      </Routes>
    </BrowserRouter>

   
  </React.StrictMode>,
)
