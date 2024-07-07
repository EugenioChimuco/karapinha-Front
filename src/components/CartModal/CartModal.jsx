import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../CartContext/CartContext';
import './CartModal.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import LoginModal from '../Login/login';

const CartModal = ({ onClose }) => {
  const { cartItems, clearCart, calculateTotal, removeFromCart } = useContext(CartContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserId = localStorage.getItem('userId');
    setIsLoggedIn(loggedInStatus);
    setUserId(storedUserId);
  }, []);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      generatePDF();
      clearCart();
      onClose();
    }
  };

  const handleLoginSuccess = (userId) => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', userId);
    setUserId(userId);
    setIsLoginModalOpen(false);
    generatePDF();
    clearCart();
    onClose();
  };

  const handleClearCart = () => {
    clearCart();
    onClose();
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Título do documento
    doc.setFontSize(16);
    doc.text('RECIBOS DE SERVIÇOS DA MARCAÇÃO', 105, 20, { align: 'center' });

    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Dados dos serviços
    let yPos = 35;
    const headers = ['Serviço', 'Profissional', 'Data', 'Hora', 'Preço'];
    const rows = cartItems.map((item) => [
      item.tipoDeServico,
      item.nomeProfissional,
      item.data,
      item.horario,
      `${item.precoDoServico}kz`
    ]);

    doc.autoTable({
      startY: yPos,
      head: [headers],
      body: rows,
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 }
      },
      styles: {
        overflow: 'linebreak',
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 2,
        valign: 'middle',
        halign: 'center'
      }
    });

    yPos = doc.autoTable.previous.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total: ${calculateTotal()}kz`, 20, yPos);

    yPos += 40; 
    doc.setFont('cursive');
    doc.setFontSize(24);
    doc.text('Muito obrigado!', 105, yPos, { align: 'center' });

    const rodapeY = doc.internal.pageSize.height - 20; 
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('KarapinhaXPTO', 105, rodapeY, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Email: chimuco007@gmail.com', 105, rodapeY + 10, { align: 'center' });

    doc.save('recibo_servicos.pdf');
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>×</span>
        <h2>Seu Carrinho</h2>
        {cartItems.length === 0 ? (
          <p>O carrinho está vazio</p>
        ) : (
          <div>
            <ul>
              {cartItems.map((item, index) => (
                <li key={index} className="service-item">
                  <div>
                    <p><strong>Serviço:</strong> {item.tipoDeServico}</p>
                    <p><strong>Profissional:</strong> {item.nomeProfissional}</p>
                    <p><strong>Data:</strong> {item.data}</p>
                    <p><strong>Hora:</strong> {item.horario}</p>
                    <p><strong>Preço:</strong> {item.precoDoServico}kz</p>
                  </div>
                  <button className="remove-button" onClick={() => removeFromCart(index)}>Remover</button>
                </li>
              ))}
            </ul>
            <p><strong>Total:</strong> {calculateTotal()}kz</p>
          </div>
        )}
        <div className="modal-actions">
          <button className="clear-cart-button" onClick={handleClearCart}>Limpar Carrinho</button>
          <button className="checkout-button" onClick={handleCheckout}>Finalizar Compra</button>
        </div>
      </div>
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onSuccess={handleLoginSuccess} />}
    </div>
  );
};

export default CartModal;
