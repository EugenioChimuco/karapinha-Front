import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Register/register.css';

const RegisterModal = ({ onClose }) => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [bi, setBi] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [phone, setPhone] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [selectedHorarios, setSelectedHorarios] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchHorarios();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://localhost:7143/api/Categoria');
      const activeCategories = response.data.filter(category => category.estadoCategoria);
      setCategories(activeCategories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchHorarios = async () => {
    try {
      const response = await axios.get('https://localhost:7143/api/Horario');
      setHorarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleHorariosChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setSelectedHorarios(selectedOptions);
  };

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append('nomeCompleto', nomeCompleto);
      formData.append('email', email);
      formData.append('bi', bi);
      formData.append('phone', phone);
      formData.append('idCategoria', idCategoria);
      formData.append('foto', photo);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const registerResponse = await axios.post('https://localhost:7143/api/Profissional', formData, config);

      const idProfissional = registerResponse.data;

      const horariosData = {
        idProfissional,
        idHorarios: selectedHorarios
      };

      const horariosResponse = await axios.post('https://localhost:7143/api/Profissional/adicionar-horarios', horariosData);

      console.log('Registro bem-sucedido!', horariosResponse.data);
      onClose();
    } catch (error) {
      if (error.response) {
        setError('Ocorreu um erro ao tentar se registrar. Por favor, tente novamente.');
      } else if (error.request) {
        setError('Não foi possível se conectar ao servidor. Por favor, verifique sua conexão com a internet.');
      } else {
        setError('Ocorreu um erro ao tentar se registrar. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>X</span>
        <h2 className="register-title">Registrar</h2>
        <form>
          <div className="form-group">
            <label htmlFor="nomeCompleto" className="input-label">Nome Completo</label>
            <input
              type="text"
              id="nomeCompleto"
              placeholder="Digite seu nome completo"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bi" className="input-label">BI</label>
            <input
              type="text"
              id="bi"
              placeholder="Digite seu BI"
              value={bi}
              onChange={(e) => setBi(e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="form-row">
              <div className="form-column">
                <label htmlFor="email" className="input-label">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-column">
                <label htmlFor="phone" className="input-label">Telefone</label>
                <input
                  type="text"
                  id="phone"
                  placeholder="Digite seu telefone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="foto" className="input-label">Foto</label>
            <input
              type="file"
              id="foto"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="idCategoria" className="input-label">Categoria</label>
            <select
              id="idCategoria"
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category.idCategoria} value={category.idCategoria}>{category.tipo}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="horarios" className="input-label">Horários</label>
            <select
              id="horarios"
              multiple
              value={selectedHorarios}
              onChange={handleHorariosChange}
            >
              {horarios.map(horario => (
                <option key={horario.idHorario} value={horario.idHorario}>
                  {horario.hora}
                </option>
              ))}
            </select>
          </div>
          {error && <small className="error-message-small">{error}</small>}
          <button type="button" className="register-button" onClick={handleRegister}>Registrar</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
