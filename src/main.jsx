import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App.jsx';
import Admin from './components/AdminD/admin.jsx';
import Manager from './components/ManagerP/manager.jsx';
import Servicos from './components/Servicos/servicos.jsx';
import { CartProvider } from './components/CartContext/CartContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={App} />
          <Route path="/admin" Component={Admin} />
          <Route path="/manager" Component={Manager} />
          <Route path="/servicos" Component={Servicos} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>,
);
