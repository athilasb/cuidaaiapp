"use client";
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    // Detectar plataforma
    const detectPlatform = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      
      if (/android/i.test(userAgent)) {
        setPlatform('android');
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        setPlatform('ios');
      } else if (/Mac/.test(userAgent)) {
        setPlatform('mac');
      } else if (/Win/.test(userAgent)) {
        setPlatform('windows');
      } else {
        setPlatform('desktop');
      }
    };

    detectPlatform();

    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registrado:', registration);
        })
        .catch((error) => {
          console.error('Erro ao registrar Service Worker:', error);
        });
    }

    // Capturar evento de instalação
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar quando o app foi instalado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Para iOS, mostrar instruções
      if (platform === 'ios') {
        showIOSInstructions();
      }
      return;
    }

    // Mostrar prompt de instalação
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuário aceitou instalar o app');
    } else {
      console.log('Usuário recusou instalar o app');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const showIOSInstructions = () => {
    const isIPad = navigator.userAgent.includes('iPad');
    const instructions = isIPad
      ? 'Toque no ícone de compartilhar na barra de ferramentas e selecione "Adicionar à Tela de Início"'
      : 'Toque no ícone de compartilhar (quadrado com seta) e role para baixo até "Adicionar à Tela de Início"';
    
    alert(instructions);
  };

  const getInstallMessage = () => {
    switch(platform) {
      case 'android':
        return 'Instalar aplicativo';
      case 'ios':
        return 'Adicionar à Tela de Início';
      case 'windows':
      case 'mac':
        return 'Instalar no computador';
      default:
        return 'Instalar aplicativo';
    }
  };

  const getIcon = () => {
    switch(platform) {
      case 'android':
        return 'hugeicons:android';
      case 'ios':
        return 'hugeicons:apple';
      case 'windows':
        return 'hugeicons:windows-new';
      case 'mac':
        return 'hugeicons:apple';
      default:
        return 'hugeicons:download-01';
    }
  };

  // Não mostrar se já está instalado
  if (isInstalled) {
    return null;
  }

  // Para iOS, sempre mostrar o botão pois não há evento beforeinstallprompt
  if (platform === 'ios' || showInstallButton) {
    return (
      <>
        {/* Banner fixo no topo para mobile */}
        {(platform === 'android' || platform === 'ios') && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1c70f2',
            color: 'white',
            padding: '10px 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 2000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon icon={getIcon()} width="24" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                  {getInstallMessage()}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                  Acesse offline e receba notificações
                </div>
              </div>
            </div>
            <button
              onClick={handleInstallClick}
              style={{
                backgroundColor: 'white',
                color: '#1c70f2',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Instalar
            </button>
          </div>
        )}

        {/* Botão flutuante para desktop */}
        {(platform === 'windows' || platform === 'mac' || platform === 'desktop') && (
          <button
            onClick={handleInstallClick}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '20px',
              backgroundColor: '#1c70f2',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(28, 112, 242, 0.3)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              zIndex: 1000,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(28, 112, 242, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(28, 112, 242, 0.3)';
            }}
          >
            <Icon icon={getIcon()} width="20" />
            {getInstallMessage()}
          </button>
        )}
      </>
    );
  }

  return null;
};

export default InstallPWA;