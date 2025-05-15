'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Cookies from 'js-cookie';
import Input from '../components/input';
import { login } from '../actions/login';
import Swal from 'sweetalert2';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resultado = await login(email, senha);
      if (resultado?.login?.success) {
        const token = resultado.login.token;
        Cookies.set('auth_token', token, { expires: 7 });
        router.push('/ia');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Falha no login',
          text: resultado.error || 'Erro desconhecido',
          confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error.message || 'Erro inesperado',
        confirmButtonColor: '#d33'
      });
    }
  };


  return (
    <div className="container flex-between flex-direction-column js-container">
      <div className="flex-between al-center w100">
        <Link href="/">
          <Icon icon="iconamoon:arrow-left-2-light" width="24" style={{ color: '#86868B' }} />
        </Link>
        <div className="title-header">FAZER LOGIN</div>
        <div></div>
      </div>

      <form className="flex-direction-column w100" onSubmit={handleLogin}>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit" className="btn-secondary">ENTRAR</button>
      </form>

      <div></div>
    </div>
  );
}
