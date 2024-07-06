import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from '../Menu/menu';
import Style from "./servicos.module.css";
import Modal from './Marcacao';

export default function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
  const [modalServico, setModalServico] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('https://localhost:7143/api/Categoria');
        const categoriasAtivas = response.data.filter(categoria => categoria.estadoCategoria);
        setCategorias(['Todos', ...categoriasAtivas]);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    const fetchServicos = async () => {
      try {
        const response = await axios.get('https://localhost:7143/api/Servico/ListarTodos');
        setServicos(response.data);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      }
    };

    fetchCategorias();
    fetchServicos();
  }, []);

  const handleCategoriaChange = (categoria) => {
    setCategoriaSelecionada(categoria);
  };

  const servicosFiltrados = categoriaSelecionada === 'Todos'
    ? servicos
    : servicos.filter(servico => {
        const categoria = categorias.find(cat => cat.idCategoria === servico.idCategoria);
        return categoria && categoria.tipo === categoriaSelecionada;
      });

  const handleAgendarClick = (servico) => {
    setModalServico(servico);
  };

  const handleCloseModal = () => {
    setModalServico(null);
  };

  return (
    <main>
      <Menu />
      <div className={Style.principal}>
        <br />
        <h1>Nossos Tratamentos</h1>
        <p>Descubra o seu refúgio de beleza e cuidados no Lubango,</p>
        <div style={{ textAlign: 'center' }}>de onde sairá plena e realizada.</div>
        <br />
        <div className={Style.submenu}>
          {categorias.map(categoria => (
            <button
              key={categoria.idCategoria || categoria}
              onClick={() => handleCategoriaChange(categoria.tipo || categoria)}
              className={categoriaSelecionada === (categoria.tipo || categoria) ? Style.active : ''}
            >
              {categoria.tipo || categoria}
            </button>
          ))}
        </div>

        <section className={Style.cardsconteiner}>
          {servicosFiltrados.map(servico => (
            <article className={Style.card} key={servico.idServico}>
              <picture className={Style.imageService}>
                <img 
                  src={`https://localhost:7143${servico.fotoPath}`} 
                  alt={servico.tipoDeServico} 
                  onError={(e) => e.target.src = '/path/to/default/image.jpg'} 
                />
              </picture>
              <div className={Style.detalhe}>
                <p>Nome: {servico.tipoDeServico}</p>
                <p>Categoria: {categorias.find(cat => cat.idCategoria === servico.idCategoria)?.tipo || 'N/A'}</p>
                <p>Preço: {servico.precoDoServico}kz</p>
              </div>
              <div className={Style.agendar}>
                <input 
                  type="submit" 
                  value="Agendar" 
                  onClick={() => handleAgendarClick(servico)} 
                />
              </div>
            </article>
          ))}
        </section>
      </div>
      {modalServico && (
        <Modal 
          servico={modalServico} 
          onClose={handleCloseModal} 
        />
      )}
    </main>
  );
}
