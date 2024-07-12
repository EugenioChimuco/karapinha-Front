import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ show, handleClose }) => {
  const [key, setKey] = useState('schedule');
  const [monthlySchedule, setMonthlySchedule] = useState([]);
  const [currentDayRevenue, setCurrentDayRevenue] = useState(null);
  const [yesterdayRevenue, setYesterdayRevenue] = useState(null);
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(null);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(null);
  const [topProfessionals, setTopProfessionals] = useState([]);
  const [mostRequestedService, setMostRequestedService] = useState(null);
  const [leastRequestedService, setLeastRequestedService] = useState(null);

  useEffect(() => {
    if (show) {
      fetchMonthlySchedule();
      fetchRevenueData();
      fetchTopProfessionals();
      fetchRequestedServices();
    }
  }, [show]);

  const fetchMonthlySchedule = async () => {
    try {
      const response = await axios.get('https://localhost:7143/api/Marcacao/ListarMarcacoesPorMes');
      setMonthlySchedule(response.data);
    } catch (error) {
      console.error('Error fetching monthly schedule:', error);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const [currentDayResponse, yesterdayResponse, currentMonthResponse, lastMonthResponse] = await Promise.all([
        axios.get('https://localhost:7143/api/Marcacao/ValorFaturadoDiaCorrente'),
        axios.get('https://localhost:7143/api/Marcacao/ValorFaturadoOntem'),
        axios.get('https://localhost:7143/api/Marcacao/ValorFaturadoMesCorrente'),
        axios.get('https://localhost:7143/api/Marcacao/ValorFaturadoMesPassado'),
      ]);

      setCurrentDayRevenue(currentDayResponse.data);
      setYesterdayRevenue(yesterdayResponse.data);
      setCurrentMonthRevenue(formatRevenueData(currentMonthResponse.data));
      setLastMonthRevenue(formatRevenueData(lastMonthResponse.data));
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const fetchTopProfessionals = async () => {
    try {
      const response = await axios.get('https://localhost:7143/api/Marcacao/ProfissionaisMaisRequisitados');
      setTopProfessionals(response.data);
    } catch (error) {
      console.error('Error fetching top professionals:', error);
    }
  };

  const fetchRequestedServices = async () => {
    try {
      const [mostRequestedResponse, leastRequestedResponse] = await Promise.all([
        axios.get('https://localhost:7143/api/Marcacao/ServicoMaisSolicitado'),
        axios.get('https://localhost:7143/api/Marcacao/ServicoMenosSolicitado'),
      ]);

      setMostRequestedService(mostRequestedResponse.data);
      setLeastRequestedService(leastRequestedResponse.data);
    } catch (error) {
      console.error('Error fetching requested services:', error);
    }
  };

  const formatRevenueData = (revenueData) => {
    const formattedData = {
      valor: revenueData.valor,
      data: formatMonthYear(revenueData.data),
    };
    return formattedData;
  };

  const formatMonthYear = (dateString) => {
    const [year, month] = dateString.split('-');
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${monthNames[parseInt(month) - 1]} de ${year}`;
  };

  if (!show) {
    return null;
  }

  return (
    <div className="dashboard-modal">
      <div className="dashboard-modal-overlay" onClick={handleClose}></div>
      <div className="dashboard-modal-content">
        <button className="dashboard-close-button" onClick={handleClose}>×</button>
        <h2>ESTATÍSTICAS</h2>
        <div className="dashboard-tabs">
          <button className={key === 'schedule' ? 'active' : ''} onClick={() => setKey('schedule')}>Agenda Mensal</button>
          <button className={key === 'revenue' ? 'active' : ''} onClick={() => setKey('revenue')}>Valor Faturado</button>
          <button className={key === 'services' ? 'active' : ''} onClick={() => setKey('services')}>Serviços</button>
          <button className={key === 'professionals' ? 'active' : ''} onClick={() => setKey('professionals')}>Top Profissionais</button>
        </div>
        <div className="dashboard-tab-content">
          {key === 'schedule' && (
            <div className="schedule-content">
              <h3>Agenda Mensal</h3>
              {monthlySchedule.map(({ mesAno, marcacoes }) => (
                <div key={mesAno} className="schedule-month">
                  <h4>{mesAno}</h4>
                  <div className="schedule-table-container">
                    <table className="schedule-table">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Profissional</th>
                          <th>Serviço</th>
                          <th>Hora</th>
                          <th>Cliente</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marcacoes.map((marcacao, index) => (
                          <tr key={index}>
                            <td>{marcacao.dataMarcacao}</td>
                            <td>{marcacao.profissional}</td>
                            <td>{marcacao.servico}</td>
                            <td>{marcacao.horaMarcacao}</td>
                            <td>{marcacao.cliente}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
          {key === 'revenue' && (
            <div>
              <h3>Valor Faturado</h3>
              <ul>
                <li>Corrente:  {currentDayRevenue?.valor}kz  - {currentDayRevenue?.data}</li>
                <li>Ontem: {yesterdayRevenue?.valor}kz  - {yesterdayRevenue?.data}</li>
                <li>Mês Corrente:  {currentMonthRevenue?.valor}kz  - {currentMonthRevenue?.data}</li>
                <li>Mês Passado:  {lastMonthRevenue?.valor}kz  - {lastMonthRevenue?.data}</li>
              </ul>
            </div>
          )}
          {key === 'services' && (
            <div>
              <h3>Serviços</h3>
              <ul>
                <li>Mais Solicitado: {mostRequestedService?.nomeServico} ({mostRequestedService?.totalMarcacoes} solicitações)</li>
                <li>Menos Solicitado: {leastRequestedService?.nomeServico} ({leastRequestedService?.totalMarcacoes} solicitação)</li>
              </ul>
            </div>
          )}
          {key === 'professionals' && (
            <div>
              <h3>Top 5 Profissionais</h3>
              <ul>
                {topProfessionals.map((profissional, index) => (
                  <li key={profissional.idProfissional}>
                    {profissional.nomeProfissional}: {profissional.totalMarcacoes} solicitações
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
