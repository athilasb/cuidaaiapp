import Link from 'next/link';

const notificacoes = () => {
  return (
    <div className="container flex-between flex-direction-column js-container">
      <div className="header">
        <p>
          Eu vou te <strong>lembrar</strong> de registrar seus dados, até isso virar um <strong>hábito</strong> natural
          pra você.
        </p>
      </div>

      <div className="box-notifications">
        <div className="icon">
          <img src="/img/logo-cuida-ai.png" alt="Logo Cuida AI" style={{ width: '80%' }} />
        </div>
        <div className="text-content">
          <div className="title">
            Hora de cuidar de você! <span className="emoji">💙</span>
          </div>
          <div className="subtitle">
            Como está se sentindo hoje. Eu tô aqui pra te ajudar a manter o controle.
          </div>
        </div>
      </div>

      <div className="flex-direction-column w100">
        <Link href="/ia" className="btn-primary">
            Ativar Notificações
        </Link>
        <Link href="/ia" className="btn-secondary">
            Desativar Notificações
        </Link>
      </div>
    </div>
  );
};

export default notificacoes;