import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../CartContext/CartContext';
import './Marcacao.css';

const Modal = ({ servico, onClose }) => {
  const { addToCart } = useContext(CartContext);
  const [profissionais, setProfissionais] = useState([]);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [marcacoes, setMarcacoes] = useState([]);
  const [indisponivelMensagem, setIndisponivelMensagem] = useState(false); // Estado para controlar a mensagem de indisponibilidade

  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        const response = await axios.get('https://localhost:7143/api/Profissional/listarProfissionalComHorarios');
        const profissionaisDaCategoria = response.data.filter(profissional => profissional.idCategoria === servico.idCategoria);
        setProfissionais(profissionaisDaCategoria);
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
      }
    };

    fetchProfissionais();
  }, [servico.idCategoria]);

  useEffect(() => {
    const fetchMarcacoes = async () => {
      if (profissionalSelecionado && data) {
        try {
          const response = await axios.get(`https://localhost:7143/api/Marcacao/ListarPorProfissionalData/${profissionalSelecionado}/${data}`);
          setMarcacoes(response.data);
        } catch (error) {
          console.error('Erro ao buscar marcações:', error);
          setMarcacoes([]); // Limpa as marcações em caso de erro para evitar problemas futuros
        }
      }
    };

    fetchMarcacoes();
  }, [profissionalSelecionado, data]);

  useEffect(() => {
    if (profissionalSelecionado && profissionais.length > 0) {
      const profissional = profissionais.find(p => p.idProfissional === parseInt(profissionalSelecionado));
      if (profissional && profissional.horarios) {
        const horariosFiltrados = profissional.horarios.filter(horario => 
          !marcacoes.some(m => m.horaMarcacao === horario)
        );
        setHorariosDisponiveis(horariosFiltrados);
        setIndisponivelMensagem(horariosFiltrados.length === 0); // Mostra a mensagem se não houver horários disponíveis
      } else {
        setHorariosDisponiveis([]);
        setIndisponivelMensagem(true); // Mostra mensagem se não houver horários devido a problemas no backend
      }
    } else {
      setHorariosDisponiveis([]);
      setIndisponivelMensagem(false);
    }
  }, [profissionalSelecionado, marcacoes, profissionais]);

  const handleSubmit = () => {
    const profissional = profissionais.find(p => p.idProfissional === parseInt(profissionalSelecionado));

    const selectedService = {
      idServico: servico.idServico,
      idProfissional: profissional ? profissional.idProfissional : undefined,
      tipoDeServico: servico.tipoDeServico,
      precoDoServico: servico.precoDoServico,
      nomeProfissional: profissional ? profissional.nomeCompleto : '',
      data,
      horario
    };

    addToCart(selectedService);
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>×</span>
        <h2>Agendar Serviço</h2>
        <div className="form-group">
          <br />
          <label htmlFor="profissional">Profissional:</label>
          <select
            id="profissional"
            value={profissionalSelecionado}
            onChange={(e) => setProfissionalSelecionado(e.target.value)}
          >
            <option value="">Selecione um profissional</option>
            {profissionais.map((profissional) => (
              <option key={profissional.idProfissional} value={profissional.idProfissional}>
                {profissional.nomeCompleto}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="data">Data:</label>
          <input
            type="date"
            id="data"
            value={data}
            min={today}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="horario">Horário:</label>
          <select
            id="horario"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          >
            <option value="">Selecione um horário</option>
            {horariosDisponiveis.map((horario, index) => (
              <option key={index} value={horario}>
                {horario}
              </option>
            ))}
          </select>
        </div>
        {indisponivelMensagem && (
          <p className="indisponivel-msg">Não há horários disponíveis para o profissional selecionado neste dia.</p>
        )}
        <hr />
        <div>
          <h3>Detalhes do Serviço</h3>
          <p><strong>Serviço:</strong> {servico.tipoDeServico}</p>
          <p><strong>Preço:</strong> {servico.precoDoServico}kz</p>
        </div>
        <div className="modal-actions">
          <button onClick={handleSubmit} disabled={horario === '' || profissionalSelecionado === '' || data === ''}>Adicionar ao Carrinho</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
