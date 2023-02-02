import axios,{AxiosError} from 'axios'///para usar a api
import {parseCookies} from 'nookies' // serve para pegar os cookies
import {AuthTokenError} from './errors/AuthTokenErro'
import {singOut} from '../contexts/AuthContext' 

export function setupAPIClient(ctx = undefined){
    let cookies = parseCookies(ctx)

    const api = axios.create({
        baseURL: 'http://localhost:3333',
        headers:{
            Authorization:`Bearer ${cookies['@nextauth.token']}`
        }
    })

    api.interceptors.response.use(response =>{
        return response;

    }, (error:AxiosError)=>{
        if(error.response.status === 401){
            //qualquer erro 401 (Não autorizado ) devemos deslogar o usuario
            if(typeof window !== undefined){
                //chamar a função para desligar o usuário
                singOut();
            }else{
                return Promise.reject(new AuthTokenError())
            }
        }
        return Promise.reject(error)
    })

    return api;
}