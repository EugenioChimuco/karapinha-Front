import React, { useState } from 'react';
import axios from 'axios';
import './horario.css';

const RegisterScheduleModal = ({ onClose, onRegister }) => {
  const [hora, setHora] = useState('');

  const handleRegister = async () => {
    try {

      const formattedHora = `${hora}:00`; 

      const data = {
        hora: formattedHora
      };

      const response = await axios.post('https://localhost:7143/api/Horario', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Resposta do servidor:', response);
      onRegister();
      onClose();
    } catch (error) {
      console.error('Erro ao registrar horário:', error);
      if (error.response) {
        console.error('Dados do erro:', error.response.data);
        console.error('Status do erro:', error.response.status);
        console.error('Cabeçalhos do erro:', error.response.headers);
        if (error.response.data.errors) {
          console.error('Erros de validação:', error.response.data.errors);
        }
      } else if (error.request) {
        console.error('Nenhuma resposta recebida:', error.request);
      } else {
        console.error('Erro:', error.message);
      }
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2 className="register-title">Cadastrar Horário</h2>
        <div className="form-group">
          <label className="input-label">Horário</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          />
        </div>
        <button className="register-button" onClick={handleRegister}>Cadastrar</button>
      </div>
    </div>
  );
};

export default RegisterScheduleModal;
