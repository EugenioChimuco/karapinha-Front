// Admin.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RegisterModal from '../RegisterAD/registerAD';
import './admin.css';
import { validate } from '../../App';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const handleCloseRegisterModal = () => setShowRegisterModal(false);
  const handleShowRegisterModal = () => setShowRegisterModal(true);

  const fetchClients = async () => {
    validate(navigate);
    try {
      const response = await axios.get('https://localhost:7143/api/Utilizador');
      // Filtrar os clientes para remover aqueles com tipoDeUser igual a 1 (administrador)
      const filteredClients = response.data.filter(client => client.tipoDeUser !== 1);
      setClients(filteredClients);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [navigate]);

  const handleActivateUser = async (userId) => {
    console.log('ID do usuário:', userId); // Verificar se o ID está definido corretamente
    try {
      await axios.put(`https://localhost:7143/api/Utilizador/AtivarConta/${userId}`);
      fetchClients();
    } catch (error) {
      console.error('Erro ao ativar usuário:', error);
    }
  };
  const getUserTypeText = (userType) => {
    switch (userType) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Administrativo';
      case 3:
        return 'Cliente';
      default:
        return 'Desconhecido';
    }
  };
  
  const handleUnlockAccount = async (userId) => {
    console.log('ID do usuário:', userId); // Verificar se o ID está definido corretamente
    try {
      await axios.put(`https://localhost:7143/api/Utilizador/BloquearDesbloquearConta/${userId}`);
      fetchClients();
    } catch (error) {
      console.error('Erro ao desbloquear conta:', error);
    }
  };
  

  return (
    <div className="admin-container">
      <div className="navbar">
        <div className="navbar-brand">Painel Administrativo</div>
        <div className="nav-links">
          <button className="nav-button" onClick={handleLogout}>Sair</button>
        </div>
      </div>

      <div className="container">
        <button className="btn-primary" onClick={handleShowRegisterModal}>
          Adicionar Administrativo
        </button>

        <h2 className="heading">Clientes</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo de Usuário</th>
              <th>Estado do Usuário</th>
              <th>Ações</th>
              <th>Estado da Conta</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.nomeCompleto}</td>
                <td>{client.email}</td>
                <td>{getUserTypeText(client.tipoDeUser)}</td>
                <td>{client.estadoDoUtilizador ? "ativo" : "inativo"}</td>
                <td>
                  <button
                    className="btn-success"
                    onClick={() => handleActivateUser(client.idUtilizador)}
                    disabled={client.estadoDoUtilizador || client.tipoDeUser === 1}
                  >
                    Ativar
                  </button>
                </td>
                <td>{client.estadoDaConta ? "desbloqueado" : "bloqueado"}</td>
                <td>
                  <button
                    className="btn-warning"
                    onClick={() => handleUnlockAccount(client.idUtilizador)  }
                    
                    disabled={client.estadoDaConta === 'desbloqueado' || client.tipoDeUser === 1}
                    
                  >
                    
                    { client.estadoDaConta === 'desbloqueado' ? 'Bloqueado' : 'Desbloquear'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showRegisterModal && <RegisterModal onClose={handleCloseRegisterModal} />}
    </div>
  );
};

export default Admin;
