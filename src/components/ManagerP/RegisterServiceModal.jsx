import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Register/register.css';
import './RegisterServiceModal.css';

const RegisterServiceModal = ({ onClose, onRegister }) => {
  const [serviceType, setServiceType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://localhost:7143/api/Categoria');
      const activeCategories = response.data.filter(category => category.estadoCategoria === true);
      setCategories(activeCategories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append('tipoDeServico', serviceType);
      formData.append('idCategoria', categoryId);
      formData.append('precoDoServico', price);
      if (photo) {
        formData.append('foto', photo);
      }

      await axios.post('https://localhost:7143/api/Servico/Adicionar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onRegister();
      onClose();
    } catch (error) {
      console.error('Erro ao registrar serviço:', error);
      setError('Erro ao registrar serviço. Por favor, tente novamente.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>X</span>
        <h2 className="register-title">Cadastro de Serviço</h2>
        <form>
          <div className="form-group">
            <label htmlFor="serviceType" className="input-label">Tipo de Serviço</label>
            <input
              type="text"
              id="serviceType"
              placeholder="Digite o tipo de serviço"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoryId" className="input-label">Categoria</label>
            <select
              id="categoryId"
              className="styled-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.idCategoria} value={category.idCategoria}>
                  {category.tipo}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="price" className="input-label">Preço</label>
            <input
              type="text"
              id="price"
              placeholder="Digite o preço"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="photo" className="input-label">Foto</label>
            <input
              type="file"
              id="photo"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="button" className="register-button" onClick={handleRegister}>Cadastrar Serviço</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterServiceModal;
