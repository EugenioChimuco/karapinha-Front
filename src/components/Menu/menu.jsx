import React, { useContext, useState, useEffect } from 'react';
import { TiShoppingCart } from 'react-icons/ti';
import './menu.css';
import LoginModal from '../Login/login';
import EditProfileModal from '../EditProfile/editProfile';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { CartContext } from '../CartContext/CartContext';
import CartModal from '../CartModal/CartModal';

const Menu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const { cartItems } = useContext(CartContext);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserId = localStorage.getItem('userId');
    setIsLoggedIn(loggedInStatus);
    setUserId(storedUserId);
  }, []);

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userId');
    setUserId(null);
  };

  const handleLoginSuccess = (userId) => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', userId);
    setUserId(userId);
    setIsModalOpen(false); // Fechar o modal de login após o sucesso
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditProfileClick = () => {
    setIsEditProfileModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleCartClick = () => {
    setIsCartModalOpen(true);
  };

  return (
    <div className="menu">
      <span href="/" className="logo">Karapinha</span>
      <nav>
        <ul>
          <li><a href="/" className="menu-item">Home</a></li>
          <li><a href="#" className="menu-item">Sobre</a></li>
          <li><a href="/servicos" className="menu-item">Serviços</a></li>
          <div className='DivCarrinho' onClick={handleCartClick}>
            <TiShoppingCart className="Carrinho"/>
            <span>{cartItems.length}</span>
          </div>
        </ul>
      </nav>
      
      <div className="buttons">
        {isLoggedIn ? (
          <div className="profile-menu">
            <button className="iconButton" onClick={toggleDropdown}>
              <AccountCircleIcon className="profileImage" style={{ color: '#000', fontSize: 30 }} />
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleEditProfileClick}>Editar Perfil</button>
                <button className="dropdown-item" onClick={handleLogout}>Sair</button>
              </div>
            )}
          </div>
        ) : (
          <button className="login" onClick={handleLoginClick}>Entrar</button>
        )}
      </div>

      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} onSuccess={handleLoginSuccess} />}
      {isEditProfileModalOpen && <EditProfileModal userId={userId} onClose={() => setIsEditProfileModalOpen(false)} />}
      {isCartModalOpen && <CartModal onClose={() => setIsCartModalOpen(false)} />}
    </div>
  );
};

export default Menu;
