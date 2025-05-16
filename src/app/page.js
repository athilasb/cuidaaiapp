"use client"; // Marca o componente como cliente

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [splashShown, setSplashShown] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const splashState = localStorage.getItem('splashShown');
    
    if (!splashState) {
      setSplashShown(false);
      setTimeout(() => {
        setSplashShown(true);
        localStorage.setItem('splashShown', 'true');
      }, 1500);
    } else {
      setSplashShown(true);
    }
  }, []);

  const slides = [
    {
      title: 'Acompanhe',
      description: 'Acompanhe seus medicamentos, sintomas, hábitos e dados de saúde em um só lugar. Uma IA que te ajuda a se entender melhor.',
      img: '/img/slide1.PNG'
    },
    {
      title: 'Lembre',
      description: 'Receba lembrets inteligentes e interativos. Registre tudo com um toque com uma IA que aprende com você.',
      img: '/img/slide2.PNG'
    },
    {
      title: 'Compartilhe',
      description: 'Compartilhe seus cuidados com quem cuida de você. Seu médico vai entender o que realmente importa. .',
      img: '/img/slide3.PNG'
    }
  ];

  const dots = slides.map((_, index) => (
    <div
      key={index}
      className={`dot js-dot ${currentSlide === index ? 'active' : ''}`}
      onClick={() => setCurrentSlide(index)}
    />
  ));
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [slides.length]);

  return (
      <div>
        <div className={`splash ${splashShown ? 'fadeOut' : ''}`} style={{ textAlign: 'center', display: splashShown ? 'none' : 'flex' }}>
          <h1>
            <img src="/img/logo-cuida-ai.png" alt="" style={{ width: '90%' }} />
          </h1>
        </div>
        <div className={`container flex-between flex-direction-column ${splashShown ? 'fadeIn' : ''}`} style={{ display: splashShown ? 'flex' : 'none' }}>
          <div>
            <div className="header">
              <p><strong>Cuida AI</strong>, aonde sua <strong>saúde</strong> vai muito além de um <strong>lembrete</strong>.</p>
            </div>

            {slides.map((slide, index) => (
              <div key={index} className={`slide js-slide ${currentSlide === index ? 'active' : ''}`}>
                <div className="card">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                  <br />
                  <div className="box"><img className="carrousel" src={slide.img} alt="Logo Cuida AI" /></div>
                </div>
              </div>
            ))}

            <div className="dots">
              {dots}
            </div>
          </div>
          <div className="flex-direction-column w100">
            <Link href="/cadastrar" className="btn-primary">Iniciar agora mesmo</Link>
            <Link href="/login" className="btn-secondary">Já tenho uma conta</Link>
          </div>
        </div>
      </div>
  );
}
