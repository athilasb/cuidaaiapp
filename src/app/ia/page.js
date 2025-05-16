"use client";
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import AuthGuard from '../components/AuthGuard';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

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
  const scrollElement = document.scrollingElement || document.documentElement;

  scrollElement.scrollTo({
    top: scrollElement.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

const Chat = () => {
  const [mensagens, setMensagens] = useState([]);
  const inputRef = useRef(null);

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
        }
          setTimeout(() => {
          scrollToBottom();
        },200)
        Swal.close();
      } catch (error) {
        console.error("Erro ao consultar mensagens:", error);
      }
    }

    carregarMensagens();
  }, []);
  useEffect(() => {
  if (mensagens.length > 0) {
    setTimeout(() => {
      scrollToBottom();
    },100)
  }
}, [mensagens]);

  const enviarMensagem = async (mensagemTexto) => {
    const agora = new Date().toISOString();

    // Adiciona a mensagem do usuário e o loading do sistema
    setMensagens((prev) => [
      ...prev,
      { role: "user", content: mensagemTexto, data: agora },
      { role: "system", content: "loading", data: agora, loading: true } // Mensagem temporária com flag
    ]);

    const formData = new FormData();
    const token = Cookies.get('auth_token') ?? "";
    formData.append('token', token);
    formData.append('mensage', mensagemTexto); // corrigido 'mensage' para 'mensagem'

    try {
      const response = await fetch('https://infoadmdev.infodental.dental/infoservices/cuidaai/ia.php', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success && data.mensagem) {
        setMensagens((prev) => {
          const novasMensagens = [...prev];

          // Remove o último item (mensagem de loading)
          novasMensagens.pop();

          // Adiciona a mensagem real da IA
          novasMensagens.push({
            role: "system",
            content: data.mensagem,
            data: new Date().toISOString()
          });

          return novasMensagens;
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };


  const handleEnviarMensagem = () => {
    const valor = inputRef.current.value.trim();
    if (!valor) return;

    enviarMensagem(valor);
    inputRef.current.value = "";
  };

  return (
    <AuthGuard>
      <div className="container flex-direction-column js-container">
        <div className="w100 header-chat">
          <div className="flex-between al-center w100">
            <span><Icon icon="hugeicons:menu-two-line" width="24" style={{ color: '#86868B' }} /></span>
            <div className="title-header">Cada dia Importa</div>
            <span><Icon icon="stash:calendar-light" width="24" style={{ color: '#86868B' }} /></span>
          </div>
          <div className="input-form-group">
            <input type="search" placeholder="Buscar" />
          </div>
        </div>

        <div className="content">
          <div className="chat js-scrollChat">
            <div className="chat-message">
              {mensagens.map((msg, index) => (
                <div key={index}>{listarMensagens(msg)}</div>
              ))}
            </div>
          </div>
          <div className="input-ia">
            <div className="input-area">
              <input type="text" placeholder="Mensagem Aqui" ref={inputRef} onKeyDown={(e) => {
                if (e.key === "Enter") handleEnviarMensagem();
              }} />
              <button onClick={handleEnviarMensagem}>
                <Icon icon="ic:baseline-send" width="24" style={{ color: '#1c70f2' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Chat;
