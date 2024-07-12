// AppointmentsModal.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './appointmentsModal.css';

const AppointmentsModal = ({ userId, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    if (!userId) {
      setError('Usuário não logado.');
      return;
    }

    const fetchAppointments = async () => {
      try {
        const appointmentsResponse = await axios.get(`https://localhost:7143/api/Marcacao/cliente/${userId}/marcacoes`);
        const profissionaisResponse = await axios.get('https://localhost:7143/api/Profissional');
        const servicosResponse = await axios.get('https://localhost:7143/api/Servico/ListarTodos');

        const profissionaisMap = profissionaisResponse.data.reduce((map, profissional) => {
          map[profissional.idProfissional] = profissional;
          return map;
        }, {});

        const servicosMap = servicosResponse.data.reduce((map, servico) => {
          map[servico.idServico] = servico;
          return map;
        }, {});

        const formattedAppointments = [];

        appointmentsResponse.data.forEach(appointment => {
          const appointmentData = {
            idMarcacao: appointment.idMarcacao,
            dataDeMarcacao: appointment.dataDeMarcacao,
            precoTotal: 0, // Inicia o preço total
            estadoDeMarcacao: appointment.estadoDeMarcacao,
            listaMarcacoes: []
          };

          appointment.listaMarcacoes.forEach(item => {
            const servico = servicosMap[item.idServico];
            if (servico) {
              appointmentData.precoTotal += servico.precoDoServico;
              const profissional = profissionaisMap[item.idProfissional];
              appointmentData.listaMarcacoes.push({
                idMarcacaoServico: item.idMarcacaoServico,
                idServico: item.idServico,
                idProfissional: item.idProfissional,
                dataMarcacao: item.dataMarcacao,
                horaMarcacao: item.horaMarcacao,
                precoDaMarcacao: servico.precoDoServico.toFixed(2),
                nomeProfissional: profissional ? profissional.nomeCompleto : '',
                nomeServico: servico.tipoDeServico
              });
            }
          });

          formattedAppointments.push(appointmentData);
        });

        setAppointments(formattedAppointments);
        setProfissionais(profissionaisResponse.data);
        setServicos(servicosResponse.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Não foi possível carregar as marcações do cliente.');
      }
    };

    fetchAppointments();
  }, [userId]);

  return (
    <div className="appointments-modal">
      <div className="appointments-content">
        <span className="close" onClick={onClose}>X</span>
        <h2>Minhas Marcações</h2>
        {error && <p className="error-message">{error}</p>}
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Profissional</th>
              <th>Serviço</th>
              <th>Hora</th>
              <th>Preço</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.idMarcacao} className={appointment.estadoDeMarcacao ? 'aceite' : 'pendente'}>
                <td>{appointment.dataDeMarcacao}</td>
                <td>
                  {appointment.listaMarcacoes.map((item, index) => (
                    <div key={index}>
                        {item.nomeProfissional}
                    </div>
                  ))}
                </td>
                <td>
                  {appointment.listaMarcacoes.map((item, index) => (
                    <div key={index}>
                      {item.nomeServico} 
                    </div>
                  ))}
                </td>
                <td>
                  {appointment.listaMarcacoes.map((item, index) => (
                    <div key={index}>{item.horaMarcacao}</div>
                  ))}
                </td>
                <td>{appointment.precoTotal.toFixed(2)}</td>
                <td>{appointment.estadoDeMarcacao ? 'Aceite' : 'Pendente'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsModal;
