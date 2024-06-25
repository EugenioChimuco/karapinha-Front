// ChangePasswordModal.js
import React, { useState } from 'react';

const ChangePasswordModal = ({ onClose, onPasswordChange }) => {
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = () => {
    // Faça a lógica para enviar a nova senha para o servidor
    onPasswordChange(newPassword);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>X</span>
        <h2>Alterar Senha</h2>
        <input
          type="password"
          placeholder="Nova Senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleChangePassword}>Alterar Senha</button>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
