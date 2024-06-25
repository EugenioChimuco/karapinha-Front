import React, { useState } from 'react';
import './RegisterCategoryModal.css';

const RegisterCategoryModal = ({ onClose, onRegister }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister({ tipo: categoryName });
    setCategoryName('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Adicionar Categoria</h2>
        <button className="close-button" onClick={onClose}>X</button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="categoryName">Nome da Categoria:</label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCategoryModal;
