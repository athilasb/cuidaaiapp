"use client"; // Marca o componente como cliente
import Link from 'next/link'; // Importa o Link do Next.js
import { Icon } from '@iconify/react'

import Input from '../components/input';

export default function Cadastrar() {
  return (
    <div className="container flex-between flex-direction-column js-container">
      <div className="flex-between al-center w100">
        <Link href="/" className="js-voltar">
          <Icon icon="iconamoon:arrow-left-2-light" width="24" style={{ color: '#86868B' }} />
        </Link>
        <div className="title-header">CADASTRAR</div>
        <a href="javascript:" className="btn-acao">Finalizar</a>
      </div>

      <div className="flex-direction-column w100">
        <Input placeholder="Email" type="email" />
        <Input placeholder="Senha" type="password" />
      </div>
      <div></div>
    </div>
  );
}
