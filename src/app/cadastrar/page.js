'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Cookies from 'js-cookie';
import Input from '../components/input';
import { criarConta } from '../actions/criarConta';
import Swal from 'sweetalert2';
import { validarEmail } from '../utils/funcoes';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleCriarConta = async (e) => {
    e.preventDefault();
    try {

      if(!validarEmail(email)) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Email inválido',
          confirmButtonColor: '#d33'
        });
        return;
      }
      Swal.fire({
        title: 'Carregando...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });
      const resultado = await criarConta(email, senha);

      if (resultado?.login?.success) {
        const token = resultado.login.token;
        Swal.close();
        Cookies.set('auth_token', token, { expires: 7 });
        router.push('/ia');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Falha no login',
          text: resultado.error || 'Erro desconhecido',
          confirmButtonColor: '#d33'
        });
        Swal.close();
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
        <Link href="/" className="js-voltar">
          <Icon icon="iconamoon:arrow-left-2-light" width="24" style={{ color: '#86868B' }} />
        </Link>
        <div className="title-header">CADASTRAR</div>
        <span></span>
      </div>

      <form className="flex-direction-column w100" onSubmit={handleCriarConta}>
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
        <button type="submit" className="btn-secondary">Cadastrar</button>
      </form>

      <div></div>
    </div>
  );
}
