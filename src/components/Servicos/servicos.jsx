import React, { useState } from 'react';
import Menu from '../Menu/menu';
import Style from "./servicos.module.css";
import imagem from './service01.jpg';
import imagem1 from './service02.jpg';
import imagem2 from './service03.jpg';

const servicos = [
  { nome: 'Barbearia', categoria: 'Corte de Cabelo', preco: '1000kz', imagem: imagem },
  { nome: 'Manicure', categoria: 'Cuidado das Unhas', preco: '1500kz', imagem: imagem1 },
  { nome: 'Pedicure', categoria: 'Cuidado dos Pés', preco: '2000kz', imagem: imagem2 },

  // Adicione mais serviços conforme necessário
];

const categorias = ['Todos', 'Corte de Cabelo', 'Cuidado das Unhas', 'Cuidado dos Pés'];

export default function Servicos() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');

  const handleCategoriaChange = (categoria) => {
    setCategoriaSelecionada(categoria);
  };

  const servicosFiltrados = categoriaSelecionada === 'Todos'
    ? servicos
    : servicos.filter(servico => servico.categoria === categoriaSelecionada);

  return (
    <main> 
      <Menu /> 
      <div className={Style.principal}>
         <br />
        <h1>Nossos Tratamentos</h1>
        <p>Descubra o seu refúgio de beleza e cuidados no Lubango, <br /> 
           <center>de onde sairá plena e realizada.</center></p>
         <br />
        <div className={Style.submenu}>
          {categorias.map(categoria => (
            <button 
              key={categoria} 
              onClick={() => handleCategoriaChange(categoria)}
              className={categoriaSelecionada === categoria ? Style.active : ''}
            >
              {categoria}
            </button>
          ))}
        </div>

        <section className={Style.cardsconteiner}>
          {servicosFiltrados.map(servico => (
            <article className={Style.card} key={servico.nome}>
              <picture className={Style.imageService}>
                <img src={servico.imagem} alt={servico.nome} />
              </picture>
              <div className={Style.detalhe}>
                <p>Nome: {servico.nome}</p>
                <p>Categoria: {servico.categoria}</p>
                <p>Preço: {servico.preco}</p>
              </div>
              <div className={Style.agendar}>
                <input type="submit" value="Agendar" />
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
