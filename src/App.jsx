// src/App.jsx
import React, { useEffect } from 'react';
import ImageCarousel from './components/Carousel/slide';
import './App.css';
import { useNavigate } from 'react-router-dom';


const  validate = async (navigate)=>{ 

  const log = await localStorage.getItem('isLoggedIn') === 'true'
  if(log){
    if(localStorage.getItem('userId')=== '1'){
      navigate("/admin");
    }
  }else if(localStorage.getItem('userId')=== '2'){
    navigate("/manager");
  }else {
    navigate("/");
  }
}
const App = () => {

  const navigate = useNavigate();
  useEffect(()=>{
    validate(navigate)
  },[])
  

  return (
  
    <div className="App">
    
      <ImageCarousel />
    </div>
  );
};

export default App;
export {validate}
