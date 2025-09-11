"use client";
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState('');
  const [showMobilePrompt, setShowMobilePrompt] = useState(false);
  const [dismissedPrompt, setDismissedPrompt] = useState(false);

  useEffect(() => {
    // Verificar se já foi dispensado anteriormente
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed === 'true') {
      setDismissedPrompt(true);
    }
    
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
    
    // Mostrar prompt para mobile após 3 segundos (se não foi dispensado)
    if ((platform === 'android' || platform === 'ios') && !dismissedPrompt && !isInstalled) {
      setTimeout(() => {
        setShowMobilePrompt(true);
      }, 3000);
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
      setShowMobilePrompt(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [platform, dismissedPrompt, isInstalled]);

  const handleDismissPrompt = () => {
    setShowMobilePrompt(false);
    setDismissedPrompt(true);
    localStorage.setItem('installPromptDismissed', 'true');
  };
  
  const handleInstallClick = async () => {
    setShowMobilePrompt(false);
    
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

  // Modal de prompt para mobile
  if (showMobilePrompt && (platform === 'android' || platform === 'ios')) {
    return (
      <>
        {/* Overlay */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'flex-end',
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Modal */}
          <div style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '20px 20px 0 0',
            padding: '25px',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
            animation: 'slideUp 0.3s ease'
          }}>
            {/* Ícone e Título */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#e8f0fe',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon icon="hugeicons:smartphone-01" width="30" style={{ color: '#1c70f2' }} />
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Instalar CuidaAI
                </h3>
                <p style={{
                  margin: '5px 0 0',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  Adicione à tela inicial do seu celular
                </p>
              </div>
            </div>
            
            {/* Benefícios */}
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Icon icon="hugeicons:wifi-off" width="20" style={{ color: '#1c70f2' }} />
                <span style={{ fontSize: '14px', color: '#333' }}>Acesse mesmo offline</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Icon icon="hugeicons:notification-03" width="20" style={{ color: '#1c70f2' }} />
                <span style={{ fontSize: '14px', color: '#333' }}>Receba notificações importantes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon icon="hugeicons:flash" width="20" style={{ color: '#1c70f2' }} />
                <span style={{ fontSize: '14px', color: '#333' }}>Acesso rápido e direto</span>
              </div>
            </div>
            
            {/* Botões */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleDismissPrompt}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  color: '#666',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Agora não
              </button>
              <button
                onClick={handleInstallClick}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: '#1c70f2',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Icon icon="hugeicons:download-01" width="20" />
                Instalar App
              </button>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
      </>
    );
  }
  
  // Botão pequeno para reabrir o prompt (mobile)
  if ((platform === 'android' || platform === 'ios') && !showMobilePrompt && dismissedPrompt && !isInstalled) {
    return (
      <button
        onClick={() => setShowMobilePrompt(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#1c70f2',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(28, 112, 242, 0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}
      >
        <Icon icon="hugeicons:download-01" width="24" />
      </button>
    );
  }

  // Botão flutuante para desktop
  if ((platform === 'windows' || platform === 'mac' || platform === 'desktop') && showInstallButton) {
    return (
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
    );
  }

  return null;
};

export default InstallPWA;