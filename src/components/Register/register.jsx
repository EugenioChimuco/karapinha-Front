import React, { useState } from 'react';
import axios from 'axios';
import './register.css';

const RegisterModal = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [bi, setBi] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
  const phoneRegex = /^[0-9]{9}$/;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Email inválido. O email deve ser no formato correto.');
      return;
    }

    if (!phoneRegex.test(phone)) {
      setError('Número de telefone inválido. Deve conter exatamente nove dígitos.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('UserName', username);
      formData.append('Password', password);
      formData.append('TipoDeUser', 3); 
      formData.append('NomeCompleto', nomeCompleto);
      formData.append('BI', bi);
      formData.append('Email', email);
      formData.append('Phone', phone);
      if (photo) {
        formData.append('Foto', photo);
      }

      const response = await axios.post('https://localhost:7143/api/Utilizador', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Registration successful!', response.data);
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
            <label htmlFor="username" className="input-label">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              placeholder="Digite seu nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
          <button type="button" className="register-button" onClick={handleRegister}>Registrar</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
