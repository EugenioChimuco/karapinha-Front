import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './manager.css';
import { useNavigate } from 'react-router-dom';
import RegisterModal from './RegisterProfissional';
import RegisterScheduleModal from './horario';
import RegisterServiceModal from './RegisterServiceModal';
import RegisterCategoryModal from './RegisterCategoryModal';
import UpdateProfileModal from './UpdateProfileModal';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('professional');
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRegisterScheduleModal, setShowRegisterScheduleModal] = useState(false);
  const [showRegisterServiceModal, setShowRegisterServiceModal] = useState(false);
  const [showRegisterCategoryModal, setShowRegisterCategoryModal] = useState(false);
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    checkAccountStatus();
    fetchCategories();
    fetchProfessionals();
  }, []);

  useEffect(() => {
    if (activeTab === 'professional') fetchProfessionals();
    if (activeTab === 'services') fetchServices();
    if (activeTab === 'schedule') fetchSchedules();
    if (activeTab === 'appointments') fetchAppointments();
    if (activeTab === 'categories') fetchActiveCategories();
  }, [activeTab, refreshKey]);

  const checkAccountStatus = async () => {
    try {
      const response = await axios.get('https://localhost:7143/api/Utilizador');
      setUserProfile(response.data);
      if (!response.data.estadoDaConta) {
        setShowUpdateProfileModal(true);
      }
    } catch (error) {
      console.error('Erro ao verificar estado da conta:', error);
    }
  };

  const handleLogout = async () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    if (!userProfile.estadoDaConta) {
      setShowUpdateProfileModal(true);
    } else {
      navigate('/');
    }
  };

  const handleUpdateProfileClose = () => {
    setShowUpdateProfileModal(false);
    if (!userProfile.estadoDaConta) {
      navigate('/');
    }
  };

  const fetchProfessionals = async () => {
    try {
      const response = await axios.get('https://localhost:7143/api/Profissional/listarProfissionalComHorarios');
      setProfessionals(response.data);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://localhost:7143/api/Servico/ListarTodos');
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('https://localhost:7143/api/Marcacao');
      setAppointments(response.data);
    } catch (error) {
      console.error('Erro ao buscar marcações:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://localhost:7143/api/Categoria');
      setCategories(response.data);
      const categoriesMap = response.data.reduce((acc, category) => {
        acc[category.idCategoria] = category.tipo;
        return acc;
      }, {});
      setCategoriesMap(categoriesMap);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchActiveCategories = async () => {
    try {
      const response = await axios.get('https://localhost:7143/api/Categoria');
      const activeCategories = response.data.filter(category => category.estadoCategoria);
      setActiveCategories(activeCategories);
    } catch (error) {
      console.error('Erro ao buscar categorias ativas:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('https://localhost:7143/api/Horario');
      setSchedules(response.data);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDeleteProfessional = async (professionalId) => {
    try {
      await axios.delete(`https://localhost:7143/api/Profissional/${professionalId}`);
      setRefreshKey(oldKey => oldKey + 1);
    } catch (error) {
      console.error('Erro ao excluir profissional:', error);
    }
  };

  const handleDeleteService = async (idServico) => {
    try {
      await axios.delete(`https://localhost:7143/api/Servico/Apagar/${idServico}`);
      setRefreshKey(oldKey => oldKey + 1);
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await axios.delete(`https://localhost:7143/api/Horario/${scheduleId}`);
      setRefreshKey(oldKey => oldKey + 1);
    } catch (error) {
      console.error('Erro ao excluir horário:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      console.log(`Tentando excluir a categoria com ID: ${categoryId}`);
      await axios.put(`https://localhost:7143/api/Categoria/BloquearCategoria${categoryId}`);
      setRefreshKey(oldKey => oldKey + 1);
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
    }
  };

  const handleAcceptAppointment = async (idMarcacao) => {
    try {
      await axios.put(`https://localhost:7143/api/Marcacao/${idMarcacao}`, { estadoDeMarcacao: 'confirmado' });
      setRefreshKey(oldKey => oldKey + 1);
    } catch (error) {
      console.error('Erro ao confirmar marcação:', error);
    }
  };

  const handleRejectAppointment = async (idMarcacao) => {
    try {
      await axios.put(`https://localhost:7143/api/MarcacaoServico/${idMarcacao}`, { estadoDeMarcacao: 'negado' });
      setRefreshKey(oldKey + 1);
    } catch (error) {
      console.error('Erro ao negar marcação:', error);
    }
  };

  const handleShowRegisterModal = () => {
    if (activeTab === 'schedule') {
      setShowRegisterScheduleModal(true);
    } else if (activeTab === 'services') {
      setShowRegisterServiceModal(true);
    } else if (activeTab === 'categories') {
      setShowRegisterCategoryModal(true);
    } else {
      setShowRegisterModal(true);
    }
  };

  const handleCloseRegisterModal = () => {
    if (activeTab === 'schedule') {
      setShowRegisterScheduleModal(false);
    } else if (activeTab === 'services') {
      setShowRegisterServiceModal(false);
    } else if (activeTab === 'categories') {
      setShowRegisterCategoryModal(false);
    } else {
      setShowRegisterModal(false);
    }
  };

  const handleRegister = async (data) => {
    try {
      if (activeTab === 'schedule') {
        await axios.post('https://localhost:7143/api/Horario', data);
      } else if (activeTab === 'professional') {
        await axios.post('https://localhost:7143/api/Profissional', data);
      } else if (activeTab === 'services') {
        await axios.post('https://localhost:7143/api/Servico', data);
      } else if (activeTab === 'categories') {
        await axios.post('https://localhost:7143/api/Categoria', data);
      }
      setRefreshKey(oldKey => oldKey + 1);
      handleCloseRegisterModal();
    } catch (error) {
      console.error('Erro ao registrar:', error);
    }
  };

  const renderTable = () => {
    switch (activeTab) {
      case 'professional':
        return (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Categoria</th>
                <th>Horários</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {professionals.map((professional) => (
                <tr key={professional.idProfissional}>
                  <td>{professional.nomeCompleto}</td>
                  <td>{professional.email}</td>
                  <td>{categoriesMap[professional.idCategoria] || 'Carregando...'}</td>
                  <td>
                    {professional.horarios.map((horario, index) => (
                      <div key={index}>{horario}</div>
                    ))}
                  </td>
                  <td>
                    <button
                      className="btn-remove"
                      onClick={() => handleDeleteProfessional(professional.idProfissional)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'services':
        return (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.idServico}>
                  <td>{service.tipoDeServico}</td>
                  <td>{categoriesMap[service.idCategoria] || 'Carregando...'}</td>
                  <td>{service.precoDoServico}</td>
                  <td>
                    <button
                      className="btn-remove"
                      onClick={() => handleDeleteService(service.idServico)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'schedule':
        return (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hora</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.idHorario}>
                  <td>{schedule.idHorario}</td>
                  <td>{schedule.hora}</td>
                  <td>
                    <button
                      className="btn-remove"
                      onClick={() => handleDeleteSchedule(schedule.idHorario)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'appointments':
        return (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Preço</th>
                <th>Estado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.idMarcacao}>
                  <td>{appointment.idMarcacao}</td>
                  <td>{appointment.idUtilizador}</td>
                  <td>{appointment.dataDeMarcacao}</td>
                  <td>{appointment.precoDaMarcacao}</td>
                  <td>{appointment.estadoDeMarcacao ? 'Aceito' : 'Negado'}</td>
                  <td>
                    <button
                      className="btn-remove"
                      onClick={() => handleRejectAppointment(appointment.idMarcacao)}
                    >
                      Negar
                    </button>
                    <button
                      className="btn-confirm"
                      onClick={() => handleAcceptAppointment(appointment.idMarcacao)}
                    >
                      Aceitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'categories':
        return (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {activeCategories.map((category) => (
                <tr key={category.idCategoria}>
                  <td>{category.idCategoria}</td>
                  <td>{category.tipo}</td>
                  <td>
                    <button className="btn-edit">Editar</button>
                    <button
                      className="btn-remove"
                      onClick={() => handleDeleteCategory(category.idCategoria)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
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

      <div className="submenu">
        <button className={activeTab === 'professional' ? 'active' : ''} onClick={() => handleTabChange('professional')}>Profissional</button>
        <button className={activeTab === 'services' ? 'active' : ''} onClick={() => handleTabChange('services')}>Serviços</button>
        <button className={activeTab === 'schedule' ? 'active' : ''} onClick={() => handleTabChange('schedule')}>Horário</button>
        <button className={activeTab === 'appointments' ? 'active' : ''} onClick={() => handleTabChange('appointments')}>Marcações</button>
        <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => handleTabChange('categories')}>Categorias</button>
      </div>

      <div className="container">
        <button className="btn-primary" onClick={handleShowRegisterModal}>
          Adicionar {activeTab === 'professional' ? 'Profissional' : activeTab === 'services' ? 'Serviço' : activeTab === 'schedule' ? 'Horário' : activeTab === 'categories' ? 'Categoria' : 'Marcação'}
        </button>

        <h2 className="heading">{activeTab === 'professional' ? 'Profissionais' : activeTab === 'services' ? 'Serviços' : activeTab === 'schedule' ? 'Horários' : activeTab === 'categories' ? 'Categorias' : 'Marcações'}</h2>
        {renderTable()}
      </div>

      {showRegisterModal && <RegisterModal onClose={handleCloseRegisterModal} onRegister={handleRegister} />}
      {showRegisterScheduleModal && <RegisterScheduleModal onClose={handleCloseRegisterModal} onRegister={handleRegister} />}
      {showRegisterServiceModal && <RegisterServiceModal onClose={handleCloseRegisterModal} onRegister={handleRegister} />}
      {showRegisterCategoryModal && <RegisterCategoryModal onClose={handleCloseRegisterModal} onRegister={handleRegister} />}
      {showUpdateProfileModal && <UpdateProfileModal onClose={handleUpdateProfileClose} />}
    </div>
  );
};

export default Admin;
