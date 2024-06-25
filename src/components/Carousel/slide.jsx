import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Menu from '../Menu/menu';
import './slide.css'; // Certifique-se de importar corretamente o arquivo CSS de estilo

import image1 from './images/image1.jpg';
import image2 from './images/image2.jpg';
import image3 from './images/image3.jpg';

const ImageCarousel = () => {
  return (
    <div className="carousel-container">
      <Menu />
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        showStatus={false}
      >
        <div className="carousel-slide">
          <img src={image1} alt="Slide 1" />
          <div className="carousel-caption dm-sans-carousel-caption">Seu Refúgio de Beleza e Bem-Estar</div>
        </div>
        <div className="carousel-slide">
          <img src={image2} alt="Slide 2" />
          <div className="carousel-caption dm-sans-carousel-caption">Beleza com um Toque de Excelência</div>
        </div>
        <div className="carousel-slide">
          <img src={image3} alt="Slide 3" />
          <div className="carousel-caption dm-sans-carousel-caption">Sua Beleza, Nosso Compromisso</div>
        </div>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
