import {useContext, FormEvent, useState} from 'react'

import Head from 'next/head'
import logoImg from '../../public/logo.svg'
import styles from '../../styles/home.module.scss'
import Image from 'next/image'
import {Input} from '../components/ui/Input'
import {Button} from '../components/ui/Button'
import Link from 'next/link'
import {AuthContext} from '../contexts/AuthContext'
import {toast} from 'react-toastify'

import {canSSRGuest} from '../utils/canSSRGuest'

export default function Home() {
  const {singIn} = useContext(AuthContext)

  const [email, setEmail] = useState('')//armazena a informação
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  //depois de capturar a informação é preciso atrelar aos inputs

  async function handleLogin(event: FormEvent){
    event.preventDefault();

    if(email === '' || password === ''){
      toast.warn("Preencha os dados!")
      return;
    }

    setLoading(true);


    let data = {
      email,
      password
    }

    await singIn(data)

    setLoading(false);
  }

  return (
    <>
    <Head>
      <title>
        SujeitoPizza - Faça seu Login
      </title>
    </Head>
    <div className={styles.containerCenter}>
      <Image src={logoImg} alt="Logo Sujeito Pizza"/>
    
    <div className={styles.login}>
      <form onSubmit={handleLogin}>
        <Input
        placeholder='Digite seu email'
        type="text"
        value={email}
        onChange={ (e) => setEmail(e.target.value)}//pega o que foi digitado no input
        />
        <Input
        placeholder='Digite seu senha'
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        <Button 
        type="submit"
        Loading={loading}
        >
          Acessar
        </Button>
      </form>
      <Link href="/singup" legacyBehavior>
        <a className={styles.text}>Não possui uma conta?Cadastre-se</a>
      </Link>
         
      
      
    </div>
    </div>
    </>
  )
}


export const getServerSideProps = canSSRGuest(async (ctx) => {
  return{
      props:{}
  }
})