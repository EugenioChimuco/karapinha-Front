import React from 'react';
import './CarrinhoModal.css';

const CarrinhoModal = ({ servicosNoCarrinho, onClose }) => {
  return (
    <div className="carrinho-modal">
      <div className="carrinho-modal-content">
        <span className="close" onClick={onClose}>×</span>
        <h2>Carrinho</h2>
        {servicosNoCarrinho.length === 0 ? (
          <p>O carrinho está vazio.</p>
        ) : (
          <ul>
            {servicosNoCarrinho.map((servico, index) => (
              <li key={index}>
                <p>{servico.tipoDeServico} - {servico.precoDoServico}kz</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CarrinhoModal;
