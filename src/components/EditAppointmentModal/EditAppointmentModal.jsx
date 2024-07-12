// EditAppointmentModal.js

import React, { useState } from 'react';

const EditAppointmentModal = ({ show, onClose, appointment, onUpdate }) => {
  const [newDate, setNewDate] = useState(appointment ? appointment.novaData : '');

  const handleDateChange = (event) => {
    setNewDate(event.target.value);
  };

  const handleUpdate = () => {
    onUpdate({ ...appointment, novaData: newDate });
  };

  return (
    show && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <h2>Editar Data da Marcação</h2>
          <label>Nova Data:</label>
          <input type="date" value={newDate} onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} />
          <div className="modal-buttons">
            <button className="btn-primary" onClick={handleUpdate}>Actualizar</button>
          
          </div>
        </div>
      </div>
    )
  );
};

export default EditAppointmentModal;
