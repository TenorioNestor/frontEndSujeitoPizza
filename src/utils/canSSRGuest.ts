import {GetServerSideProps, GetServerSidePropsContext,GetServerSidePropsResult} from 'next'
import {parseCookies} from 'nookies'

//função para paginas que so podem ser acessadas por visitantes
 
export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    //tem que receber o contexto
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        
        const cookies = parseCookies(ctx);
        //faz a verificação/ somente usuário não logados consegue acessar 
        if(cookies['@nextauth.token']){
            return {
                redirect:{
                    destination:'/dashboard',
                    permanent:false
            }
        }
        }


        return await fn(ctx);
    }
}