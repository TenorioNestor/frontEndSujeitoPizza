import {createContext, ReactNode, useState,useEffect} from 'react';
import {destroyCookie, setCookie, parseCookies} from 'nookies' // destruir os cookies
import router from 'next/router'  //faz o roteamento das rotas
import {api} from '../services/apiClient'
import {toast} from  'react-toastify' 
import path from 'path';


type AuthContextData = {
    user: UserProps;///informações do user
    isAuthenticated: boolean;//Para saber se ele esta logado ou não
    singIn: (credentials: SingInProps) => Promise<void>
    singOut: ()=> void
    singUp:(credentials: SingUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SingInProps = {
    email: string;
    password: string;
}
type SingUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function singOut(){//função para deslogar op usuário
    try{
        destroyCookie(undefined,'@nextauth.token')//contexto e nome do cookie
        router.push('/')
    }catch{
        console.log('erro ao deslogar')
    }
}

export function AuthProvider({children}: AuthProviderProps){
    //armazenar as informações que o usuário fizer o login
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;//converte em booleano

    //validar token do usuário
    useEffect(()=>{
        //tentar pegar algo no token/cookie 
        const {'@nextauth.token': token} = parseCookies();

        if(token){
            api.get('/me').then(response =>{
                const {id, name, email} = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(()=>{
                //se deu erro, deslogar usuário
                singOut();
            })
        }
    },[])
    
    //asunc é uma promessa - contexto para autenticação de usuário existente 
    async function singIn({email, password} : SingInProps){
        try {
            const response = await api.post('/session',{
                email, 
                password
            })
            //console.log(response.data);
            const {id, name, token} = response.data;

            setCookie(undefined,'@nextauth.token', token,{
                maxAge:60*60*24*30, //tempo que vai levar para expirar o token
                path:"/"//quais caminhos teram acesso ao cookie
            })

            setUser({
                id,
                name,
                email,
            })

            //passar para proximas requisições o nosso token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success('Logado com sucesso!')

            //redirecionar para pagina de pedidos
            router.push('/dashboard')
        } catch (err) {
            toast.error('Erro ao acessar')
            console.log("Erro ao acessar ", err)
        }
    }
    //criação de usuário
    async function singUp({name, email, password}:SingUpProps){
        try {
            const response = await api.post('/users',{
                name, 
                email,
                password
            })
            console.log("Usuário cadastrado com sucesso")
            toast.success('Conta criada!')

            router.push('/')
        } catch (err) {
            toast.error('Erro ao realizar o cadastro')
            console.log("erro ao cadastrar", err)
        }
    }


    return (
        <AuthContext.Provider value={{user, isAuthenticated, singIn, singOut, singUp}}>
            {children}
        </AuthContext.Provider>
    )
}