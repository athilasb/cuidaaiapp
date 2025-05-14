'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Input from '../components/input';

export default function LoginPage() {
  return (
    <div className="container flex-between flex-direction-column js-container">
      <div className="flex-between al-center w100">
        <Link href="/">
          <Icon icon="iconamoon:arrow-left-2-light" width="24" style={{ color: '#86868B' }} />
        </Link>
        <div className="title-header">FAZER LOGIN</div>
        <div></div>
      </div>

      <div className="flex-direction-column w100">
        <Input placeholder="Email" type="email" />
        <Input placeholder="Senha" type="password" />
        <Link href="/ativar_notificacoes" className="btn-secondary">
          ENTRAR
        </Link>
      </div>

      <div></div>
    </div>
  )
}
