import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './login.css';
import { RiUserLine } from 'react-icons/ri';
import { FaFacebookSquare, FaTwitterSquare, FaInstagramSquare } from 'react-icons/fa';
import RegisterModal from '../Register/register';
import { useNavigate } from "react-router-dom";


const LoginModal = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      const response  = await axios.post('https://localhost:7143/api/Utilizador/login', {
        username,
        password
      });

      console.log('Login successful!', response.data);
      const userId = response.data.id; 
      onSuccess(userId); 
      onClose();
      
      if(response?.data?.tipoDeUser === 1) {
        navigate("/admin");
      }else if(response?.data?.tipoDeUser === 2){
        navigate("/manager");
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
    </>
  );
};

export default LoginModal;