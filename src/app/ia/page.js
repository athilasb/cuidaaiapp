"use client";
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import AuthGuard from '../components/AuthGuard';
import Menu from '../components/Menu';
//import InstallPWA from '../components/InstallPWA';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { encryptDataClient } from '../utils/clientCrypto';
import { sendMessage } from '../actions/sendMessage';

function formatarData(dataString) {
  const agora = new Date();
  const data = new Date(dataString.replace(' ', 'T'));

  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const dataComparar = new Date(data.getFullYear(), data.getMonth(), data.getDate());

  const diffDias = Math.floor((hoje - dataComparar) / (1000 * 60 * 60 * 24));
  const horaMinuto = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (diffDias === 0) return `Hoje • ${horaMinuto}`;
  if (diffDias === 1) return `Ontem • ${horaMinuto}`;
  return `${data.toLocaleDateString('pt-BR')} • ${horaMinuto}`;
}
function formatarConteudo(texto) {
  if (!texto) return null;

  // Substitui **texto** por <strong>texto</strong>
  const comNegrito = texto.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Substitui quebras de linha por <br />
  const comQuebrasDeLinha = comNegrito.replace(/\n/g, "<br />");

  // Retorna como JSX seguro (React interpretará as tags HTML)
  return <span dangerouslySetInnerHTML={{ __html: comQuebrasDeLinha }} />;
}

function listarMensagens({ role, content, data, loading }) {

  if(role == "function"){
    return (
      <></>
    )
  }else{
     return (
      <div className={`msg ${role === "system" ? "from-system" : "from-user"}`}>
        <div>
          {loading ? (
            <Icon icon="eos-icons:three-dots-loading" width="40" height="40" />
          ) : (
            formatarConteudo(content)
          )}
        </div>
          <br/>
          <div className="msg-time">{formatarData(data)}</div>
      </div>
    );
  }
 
}

function scrollToBottom(smooth = true) {
  window.scrollTo({
    top: document.body.scrollHeight,
    left: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

const Chat = () => {
  const [mensagens, setMensagens] = useState([]);
  const [mensagensFiltradas, setMensagensFiltradas] = useState([]);
  const inputRef = useRef(null);
  const datePickerRef = useRef(null);
  const [loadingEnvio, setLoadingEnvio] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  useEffect(() => {
    async function carregarMensagens() {
      //Usar loading do sweetalert
      Swal.fire({
        title: 'Carregando...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });
      const formData = new FormData();
      const token = Cookies.get('auth_token') ?? "";
      formData.append('token', token);

      try {
        const response = await fetch('https://infoadmdev.infodental.dental/infoservices/cuidaai/listarMensagens.php', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.success && Array.isArray(data.mensagens)) {
          setMensagens(data.mensagens);
          setMensagensFiltradas(data.mensagens);
        }
          setTimeout(() => {
          scrollToBottom(false);
        },200)
        Swal.close();
      } catch (error) {
        Swal.close();
        console.error("Erro ao consultar mensagens:", error);
      }
    }

    carregarMensagens();

    // Detectar scroll para mostrar/ocultar botão de scroll para baixo
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // Mostra o botão se não estiver no final da página (com margem de 100px)
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!isNearBottom && scrollTop > 200);
    };

    // Adicionar evento de scroll na window
    window.addEventListener('scroll', handleScroll);
    
    // Detector de clique fora do filtro de data
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        // Verifica se o clique não foi no botão do calendário
        const calendarButton = event.target.closest('button[aria-label="date-filter"]');
        if (!calendarButton) {
          setShowDatePicker(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (mensagensFiltradas.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [mensagensFiltradas]);

const enviarMensagem = async (mensagemTexto) => {
  const agora = new Date().toISOString();
  setLoadingEnvio(true); // Bloqueia o botão

  const novaMensagemUsuario = { role: "user", content: mensagemTexto, data: agora };
  const loadingMessage = { role: "system", content: "loading", data: agora, loading: true };

  setMensagens((prev) => [...prev, novaMensagemUsuario, loadingMessage]);
  setMensagensFiltradas((prev) => [...prev, novaMensagemUsuario, loadingMessage]);
  
  // Scroll para baixo após adicionar mensagem
  setTimeout(() => scrollToBottom(), 100);

  const token = Cookies.get('auth_token') ?? "";
  
  // Criptografar dados antes de enviar
  const encryptedData = encryptDataClient({
    token: token,
    mensagem: mensagemTexto,
    timestamp: Date.now()
  });

  try {
    const data = await sendMessage(encryptedData);

    if (data.success && data.mensagem) {
      const respostaIA = {
        role: "system",
        content: data.mensagem,
        data: new Date().toISOString()
      };
      
      setMensagens((prev) => {
        const novasMensagens = [...prev];
        novasMensagens.pop(); // remove loading
        novasMensagens.push(respostaIA);
        return novasMensagens;
      });
      
      setMensagensFiltradas((prev) => {
        const novasMensagens = [...prev];
        novasMensagens.pop(); // remove loading
        novasMensagens.push(respostaIA);
        return novasMensagens;
      });
      
      // Scroll para baixo após receber resposta da IA
      setTimeout(() => {
        scrollToBottom();
      }, 100);
      
      // Focar no input após receber resposta
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    // Remove loading message em caso de erro
    setMensagens((prev) => {
      const novasMensagens = [...prev];
      novasMensagens.pop(); // remove loading
      return novasMensagens;
    });
    setMensagensFiltradas((prev) => {
      const novasMensagens = [...prev];
      novasMensagens.pop(); // remove loading
      return novasMensagens;
    });
    
    // Scroll para baixo mesmo em caso de erro
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }

  setLoadingEnvio(false); // Libera o botão
  
  // Focar no input após liberar
  setTimeout(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, 50);
};


  const handleEnviarMensagem = () => {
    const valor = inputRef.current.value.trim();
    if (!valor) return;

    enviarMensagem(valor);
    inputRef.current.value = "";
    // Manter foco no input
    inputRef.current.focus();
  };

  const handleFilterMessages = (category, search, dateFilter, customDateRange) => {
    let filtered = [...mensagens];
    
    // Filtro por categoria
    if (category && category !== 'all') {
      // Aqui você pode implementar a lógica para categorizar mensagens
      // Por enquanto, vamos filtrar por palavras-chave no conteúdo
      const categoryKeywords = {
        'motivacao': ['motivação', 'inspire', 'força', 'consegue', 'acredite'],
        'saude': ['saúde', 'bem-estar', 'corpo', 'mente', 'cuidado'],
        'dicas': ['dica', 'sugestão', 'recomendo', 'tente', 'experimente'],
        'exercicios': ['exercício', 'atividade', 'movimento', 'treino', 'físico'],
        'alimentacao': ['alimentação', 'comida', 'nutrição', 'dieta', 'alimento']
      };
      
      if (categoryKeywords[category]) {
        filtered = filtered.filter(msg => {
          const content = msg.content?.toLowerCase() || '';
          return categoryKeywords[category].some(keyword => 
            content.includes(keyword.toLowerCase())
          );
        });
      }
    }
    
    // Filtro por busca
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(msg => {
        const content = msg.content?.toLowerCase() || '';
        return content.includes(searchLower);
      });
    }
    
    // Filtro por data
    if (dateFilter && dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(msg => {
        if (!msg.data) return false;
        const msgDate = new Date(msg.data.replace(' ', 'T'));
        
        switch(dateFilter) {
          case 'today':
            return msgDate >= today;
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return msgDate >= yesterday && msgDate < today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return msgDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setDate(monthAgo.getDate() - 30);
            return msgDate >= monthAgo;
          case 'custom':
            if (customDateRange?.start && customDateRange?.end) {
              const start = new Date(customDateRange.start);
              const end = new Date(customDateRange.end);
              end.setHours(23, 59, 59, 999);
              return msgDate >= start && msgDate <= end;
            }
            return true;
          default:
            return true;
        }
      });
    }
    
    setMensagensFiltradas(filtered);
    setSelectedCategory(category || 'all');
    setSearchTerm(search || '');
    setSelectedDate(dateFilter || 'all');
  };

  const handleSearchMessages = (search) => {
    handleFilterMessages(selectedCategory, search, selectedDate);
  };

  const handleDateFilter = (dateFilter, customDateRange) => {
    handleFilterMessages(selectedCategory, searchTerm, dateFilter, customDateRange);
  };
  /**    <InstallPWA /> */
  return (
    <AuthGuard>
  
      <Menu 
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        mensagens={mensagens}
        onFilterMessages={handleFilterMessages}
        onSearchMessages={handleSearchMessages}
        onDateFilter={handleDateFilter}
      />
      <div className="container flex-direction-column js-container" style={{ paddingTop: '50px', position: 'relative' }}>
        <div className="w100 header-chat">
          <div className="flex-between al-center w100">
            <button 
              onClick={() => setMenuOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
            >
              <Icon icon="hugeicons:menu-01" width="24" style={{ color: '#86868B' }} />
            </button>
            <div className="title-header">Cada dia Importa</div>
            <button 
              aria-label="date-filter"
              onClick={() => setShowDatePicker(!showDatePicker)}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                padding: '5px',
                position: 'relative'
              }}
            >
              <Icon icon="stash:calendar-light" width="24" style={{ color: selectedDate !== 'all' ? '#ff9800' : '#86868B' }} />
              {selectedDate !== 'all' && (
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ff9800',
                  borderRadius: '50%'
                }}></span>
              )}
            </button>
          </div>
          <div className="input-form-group" style={{ position: 'relative' }}>
            <Icon 
              icon="hugeicons:search-01" 
              width="20" 
              style={{ 
                color: '#86868B',
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} 
            />
            <input 
              type="search" 
              placeholder="Buscar mensagens..." 
              value={searchTerm}
              onChange={(e) => handleSearchMessages(e.target.value)}
              style={{ paddingLeft: '35px' }}
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchMessages('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Icon icon="hugeicons:cancel-circle" width="20" style={{ color: '#86868B' }} />
              </button>
            )}
          </div>
        </div>
        
        {/* Espaciador para o header fixo */}
        <div style={{ height: '120px' }}></div>

        {/* Modal de Filtro de Data Rápido */}
        {showDatePicker && (
          <div ref={datePickerRef} className="date-picker-modal" style={{
            position: 'fixed',
            top: '120px',
            right: '20px',
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            padding: '15px',
            zIndex: 2000,
            minWidth: '200px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <h4 style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              marginBottom: '10px'
            }}>
              Filtrar por Data
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'all', nome: 'Todas', icon: 'stash:calendar-light' },
                { id: 'today', nome: 'Hoje', icon: 'stash:calendar-day' },
                { id: 'yesterday', nome: 'Ontem', icon: 'stash:calendar-minus' },
                { id: 'week', nome: 'Últimos 7 dias', icon: 'stash:calendar-week' },
                { id: 'month', nome: 'Últimos 30 dias', icon: 'stash:calendar-month' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => {
                    handleDateFilter(filter.id);
                    setShowDatePicker(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: selectedDate === filter.id ? '#fff3e0' : 'transparent',
                    color: selectedDate === filter.id ? '#ff9800' : '#333',
                    cursor: 'pointer',
                    fontSize: '13px',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <Icon icon={filter.icon} width="18" style={{ marginRight: '8px', color: selectedDate === filter.id ? '#ff9800' : '#86868B' }} />
                  {filter.nome}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="content" style={{ 
          flex: 1, 
          overflowY: 'auto', 
          position: 'relative'
        }}>
          <div className="chat js-scrollChat">
            <div className="chat-message">
              {mensagensFiltradas.length === 0 && searchTerm ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: '#86868B'
                }}>
                  <Icon icon="hugeicons:search-remove" width="48" style={{ marginBottom: '10px' }} />
                  <p>Nenhuma mensagem encontrada para "{searchTerm}"</p>
                </div>
              ) : mensagensFiltradas.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: '#86868B'
                }}>
                  <Icon icon="hugeicons:message-dots-01" width="48" style={{ marginBottom: '10px' }} />
                  <p>Inicie uma conversa com a IA</p>
                </div>
              ) : (
                mensagensFiltradas.map((msg, index) => (
                  <div key={`msg-${index}-${msg.data}`}>{listarMensagens(msg)}</div>
                ))
              )}
            </div>
          </div>
          <div className="input-ia" style={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 99
          }}>
            <div className="input-area" style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder={loadingEnvio ? "Aguardando resposta... (digite sua próxima mensagem)" : "Mensagem Aqui"} 
                ref={inputRef} 
                style={{
                  opacity: loadingEnvio ? 0.8 : 1
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if(loadingEnvio){
                      e.preventDefault();
                      // Opcional: feedback visual ou sonoro
                      return;
                    }
                    handleEnviarMensagem();
                  }
                }} 
              />
              <button 
                onClick={() => {
                  if (!loadingEnvio) {
                    handleEnviarMensagem();
                  }
                }} 
                disabled={loadingEnvio}
                style={{
                  cursor: loadingEnvio ? 'not-allowed' : 'pointer',
                  opacity: loadingEnvio ? 0.5 : 1,
                  transition: 'opacity 0.2s ease'
                }}>
                {loadingEnvio ? (
                  <Icon icon="eos-icons:three-dots-loading" width="24" style={{ color: '#1c70f2' }} />
                ) : (
                  <Icon icon="ic:baseline-send" width="24" style={{ color: '#1c70f2' }} />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Indicador de Bloqueio de Envio */}
        {loadingEnvio && (
          <div style={{
            position: 'fixed',
            bottom: '140px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(28, 112, 242, 0.95)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 101,
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            <Icon icon="eos-icons:three-dots-loading" width="24" />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Aguardando resposta da IA...</span>
          </div>
        )}
        
        {/* Botão de Scroll para Baixo */}
        {showScrollToBottom && !loadingEnvio && (
          <button
            onClick={() => scrollToBottom(true)}
            style={{
              position: 'fixed',
              bottom: '140px',
              right: '20px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#1c70f2',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 12px rgba(28, 112, 242, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              animation: 'fadeIn 0.3s ease',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(28, 112, 242, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(28, 112, 242, 0.3)';
            }}
          >
            <Icon icon="hugeicons:arrow-down-01" width="24" />
          </button>
        )}
      </div>
      
      <style jsx>{`
        .date-picker-modal {
          position: fixed !important;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.95;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) scale(1.05);
          }
        }
      `}</style>
    </AuthGuard>
  );
};

export default Chat;
