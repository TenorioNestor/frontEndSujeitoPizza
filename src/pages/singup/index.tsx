import {useState, FormEvent, useContext} from 'react'

import Head from 'next/head'
import logoImg from '../../../public/logo.svg'
import styles from '../../../styles/home.module.scss'
import Image from 'next/image'
import {Input} from '../../components/ui/Input'
import {Button} from '../../components/ui/Button'
import Link from 'next/link'
import {AuthContext} from '../../contexts/AuthContext'
import {toast} from 'react-toastify'

export default function Singup() {
  const {singUp} = useContext(AuthContext)


  const [name, setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)

  async function handleSingUp(event: FormEvent){
    event.preventDefault();

    if(name ==='' || email === '' || password === ''){
      toast.warn('Preencha todos os campos!')
      return;
    }

    setLoading(true)

    let data = {
      name,
      email,
      password
    }

    await singUp( data)

    setLoading(false)

    
  }


  return (
    <>
    <Head>
      <title>
        SujeitoPizza - Faça seu Cadastro
      </title>
    </Head>
    <div className={styles.containerCenter}>
      <Image src={logoImg} alt="Logo Sujeito Pizza"/>
      
    
    <div className={styles.login}>
    <h1>Criando sua conta</h1>
      <form onSubmit={handleSingUp}>
      <Input
        placeholder='Digite seu nome'
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        />
        <Input
        placeholder='Digite seu email'
        type="text"
        value={email}
        onChange = {(e) => setEmail(e.target.value)}
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
          Cadastrar
        </Button>
      </form>
      <Link href="/" legacyBehavior>
        <a className={styles.text}>Já possui uma conta?Faça seu login!</a>
      </Link>
        
      
      
    </div>
    </div>
    </>
  )
}
