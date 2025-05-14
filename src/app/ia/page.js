// components/Chat.js
"use client"; 
import { useEffect } from 'react';
import { Icon } from '@iconify/react'

const Chat = () => {
  useEffect(() => {
    // Função para mover o scroll para o final
    const scrollToBottom = () => {
      const chatContainer = document.querySelector('.chat');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    };

    scrollToBottom(); // Chama a função ao montar o componente

    // Opcional: adiciona o scroll sempre que novas mensagens são renderizadas (pode ser ajustado conforme a dinâmica do chat)
  }, []);

  return (
    <div className="container flex-direction-column js-container">
      <div className="w100 header-chat">
        <div className="flex-between al-center w100">
          <span>
            <Icon icon="hugeicons:menu-two-line" width="24" style={{ color: '#86868B' }} />
          </span>
          <div className="title-header">Cada dia Importa</div>
          <span>
            <Icon icon="stash:calendar-light" width="24" style={{ color: '#86868B' }} />
          </span>
        </div>
        <div className="input-form-group">
          <input type="search" placeholder="Buscar" />
        </div>
      </div>

      <div className="content">
        <div className="chat js-scrollChat">
          <div className="chat-message">
            <div className="msg from-system">
              <p>
                👋 Olá, Kroner! Não tenho nenhum lembrete para registrar para você até agora.
                <br />
                Mas vou te acompanhando da forma que consigo enquanto isso. <span style={{ color: '#1C70F2' }}>💙</span>
              </p>
            </div>

            <div className="msg from-system">
              <div className="msg-time">Hoje • 07:00</div>
              <p>
                <strong>Bom dia, Kroner!</strong> 😊
              </p>
              <p>
                Enquanto não temos nenhuma alerta de saúde eu só queria saber{' '}
                <strong>como foi sua noite de sono</strong> e se <strong>consumiu bebida alcoólica ontem?</strong>
              </p>
              <p className="small-text">(Essa informação me ajuda a ajustar seus alertas de forma segura.)</p>
            </div>

            <div className="msg from-user">
              <p>Dormi mais ou menos.<br />E sim, bebi uma taça de vinho ontem à noite.</p>
              <div className="msg-time">Hoje • 07:30</div>
            </div>

            <div className="msg from-system">
              <div className="msg-time">Hoje • 07:40</div>
              <p>
                🛌🍷 Obrigado por avisar sobre sua noite e sobre o vinho.
                <br />
                - fica tranquilo, estou acompanhando tudo com atenção. 😊
              </p>
              <p>Se estiver com ressaca posso te sugerir uma vitamina, o que acha?</p>
            </div>

            {/* Replicar as mensagens conforme necessário */}
          </div>
        </div>
        <div className="input-ia">
            <div className="input-area">
              <input type="text" placeholder="Mensagem Aqui" />
              <button>
                <Icon icon="ic:baseline-send" width="24" style={{ color: '#1c70f2' }} />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
