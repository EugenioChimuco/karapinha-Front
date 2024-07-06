import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Register/register.css';

const EditProfileModal = ({ userId, onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [bi, setBi] = useState('');
  const [email, setEmail] = useState('');
  const [foto, setFoto] = useState(null);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError('Usuário não logado.');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7143/api/Utilizador/${userId}`);
        const userData = response.data;

        setNomeCompleto(userData.nomeCompleto);
        setBi(userData.bi);
        setEmail(userData.email);
        setPhone(userData.phone);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Não foi possível carregar os dados do usuário.');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
    }
  };

  const handleUpdate = async () => {
    if (password && password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      if (!userId) {
        setError('Usuário não logado.');
        return;
      }

      const formData = new FormData();
      formData.append('password', password);
      formData.append('nomeCompleto', nomeCompleto);
      formData.append('bi', bi);
      formData.append('email', email);
      formData.append('phone', phone);
      if (foto) {
        formData.append('foto', foto);
      }

      const response = await axios.put(`https://localhost:7143/api/Utilizador/AtualizarUtilizador/${userId}`, formData);

      setSuccessMessage('Dados atualizados com sucesso!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating user data:', error);
      if (error.response) {
        setError('Ocorreu um erro ao tentar atualizar os dados. Por favor, tente novamente.');
      } else if (error.request) {
        setError('Não foi possível se conectar ao servidor. Por favor, verifique sua conexão com a internet.');
      } else {
        setError('Ocorreu um erro ao tentar atualizar os dados. Por favor, tente novamente.');
      }
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>X</span>
        <h2 className="register-title">Editar Perfil</h2>
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
            <div className="form-row">
              <div className="form-column">
                <label htmlFor="password" className="input-label">Senha</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-column">
                <label htmlFor="confirmPassword" className="input-label">Confirmar Senha</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            {error && <small className="error-message-small">{error}</small>}
          </div>
          <button type="button" className="register-button" onClick={handleUpdate}>Atualizar</button>
          {successMessage && <small className="success-message-small">{successMessage}</small>}
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
