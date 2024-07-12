// LoginModal.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { RiUserLine } from 'react-icons/ri';
import { FaFacebookSquare, FaTwitterSquare, FaInstagramSquare } from 'react-icons/fa';
import RegisterModal from '../Register/register';
import EditProfileModal from '../EditProfile/editProfile'; // Atualize o caminho conforme necessário
import { useNavigate } from "react-router-dom";

const LoginModal = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false); // Novo estado para controlar a visibilidade do EditProfileModal
  const [userId, setUserId] = useState(null); // Novo estado para armazenar o userId
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://localhost:7143/api/Utilizador/login', {
        username,
        password
      });

      console.log('Login successful!', response.data);
      const userId = response.data.id;
      setUserId(userId); 

      if (response?.data?.tipoDeUser === 1) {
        onSuccess(userId);
        onClose();
        navigate("/admin");
      } else if (response?.data?.tipoDeUser === 2) {
        if (response?.data?.estadoDaConta) {
          onSuccess(userId);
          onClose();
          navigate("/manager");
        } else {
          setError('É obrigatório editar os seus dados.');
          setTimeout(() => {
            setShowEditProfile(true); 
          }, 3000);
        }
      } else if (response?.data?.tipoDeUser === 3) {
        console.log('estadoDoUtilizador:', response?.data?.estadoDoUtilizador);
        if (response?.data?.estadoDoUtilizador) {
          onSuccess(userId);
          onClose();
          navigate("/");
        } else {
          setError('A sua conta está inativa! Aguarde a ativação da mesma.');
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          setError('Credenciais inválidas. Verifique seu nome de usuário e senha.');
        } else {
          setError('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.');
        }
      } else if (error.request) {
        setError('Não foi possível se conectar ao servidor. Por favor, verifique sua conexão com a internet.');
      } else {
        setError('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.');
      }
    }
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
    setError(''); 
  };

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>X</span>
          <h2 className="login-title">Login</h2>
          <div className="user-icon">
            <RiUserLine size={40} />
          </div>
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
              <label htmlFor="password" className="input-label">Senha</label>
              <input
                type="password"
                id="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <small className="error-message-small">{error}</small>}
            </div>
            <button type="button" className="login-button" onClick={handleLogin}>Entrar</button>
          </form>
          <div className="social-icons">
            <FaFacebookSquare className="social-icon" />
            <FaTwitterSquare className="social-icon" />
            <FaInstagramSquare className="social-icon" />
          </div>
          <div className="additional-links">
            <a href="#" className="additional-link" onClick={handleShowRegister}>Criar conta ?</a>
            <a href="#" className="additional-link">Esqueceu a palavra-passe ?</a>
          </div>
        </div>
      </div>
      {showRegister && <RegisterModal onClose={handleCloseRegister} />}
      {showEditProfile && <EditProfileModal userId={userId} onClose={handleCloseEditProfile} />}
    </>
  );
};

export default LoginModal;
