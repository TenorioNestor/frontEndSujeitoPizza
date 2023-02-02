import {useState, FormEvent, ChangeEvent} from 'react'

import Head from 'next/head'
import {Header} from '../../components/Header'
import styles from './styles.module.scss'
import {canSSRAuth} from '../../utils/canSSRAuth'
import { toast } from 'react-toastify'
import {setupAPIClient} from '../../services/api'

import {FiUpload} from 'react-icons/fi'

type ItemProps = {
    id: string;
    name: string;

}

interface CtaegoryProps{
    categoryList: ItemProps[];
}


export default function Product({categoryList}: CtaegoryProps){
    console.log(categoryList)
    const [name, setName] = useState('');
    const [price,setPrice] = useState('');
    const [description,setDescription] = useState('')
    const [avatarUrl,setAvatarUrl] = useState('')
    const [imageAvatar,setImageAvatar] = useState(null)
    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelected, setCategorySelected] = useState(0)

    function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(!e.target.files){
            toast.error('Favor incerir uma Imagem!')
        }

        const image = e.target.files[0];

        if(!image){
            toast.error('Adicione uma imagem!')
        }

        if(image.type === 'image/jpeg'|| image.type === 'image/png' || image.type === 'image/jpeg'){
            setImageAvatar(image);
            setAvatarUrl(URL.createObjectURL(e.target.files[0]));
        }

    }
    //quando você seleciona uma nova categoria na lista 
     function handleChangeCategory(event){
        setCategorySelected(event.target.value)
     }

    async function handleRegister(event:FormEvent) {
        event.preventDefault();
        try {
            const data = new FormData();
            if(name === ''|| price === ''|| description === '' || imageAvatar=== null){
            
                toast.warn('Preencha todos os campos')
                return;
            }

            data.append('name',name);
            data.append('price', price);
            data.append('description',description)
            data.append('category_id',categories[categorySelected].id)
            data.append('file',imageAvatar);

            const apiClient = setupAPIClient();

            await apiClient.post('/product', data)

            toast.success('Cadastro realizado')

            setName('')
            setDescription('')
            setPrice('')
            setCategorySelected(0)
            setAvatarUrl('')
        } catch (err) {
            console.log(err);
            toast.error(`Ops! Erro ao cadastrar(Erro ${err})`)
        }

    }

    return(
        <>
        <Head>
            <title>Produtos - Sejeito Pizza</title>
        </Head>
        <Header/>
        <main className={styles.container}>
            <h1>
                Novo Produto
            </h1>
            <div>
                <form className={styles.form} onSubmit={handleRegister}>
                    
                    <label className={styles.labelAvatar}>
                        <span>
                            <FiUpload size={25} color="#fff"/>
                        </span>
                        <input type="file" accept='image/png, image/jpg, image/jpeg'onChange={handleFile}/>

                        {avatarUrl && (
                            <img 
                            className={styles.preview}
                            src={avatarUrl} 
                            alt="Imagem do Produto" 
                            width={250}
                            height={250}
                            />
                        )}
                    </label>


                    <select value={categorySelected} onChange={handleChangeCategory}>
                        {categories.map((item, index)=>{
                            return(
                                <option key={item.id} value={index}>
                                    {item.name}
                                </option>
                            )
                        })}
                    </select>

                    <input 
                    className={styles.input}
                    type="text" 
                    placeholder='Digite o nome do Produto'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    />
                    <input 
                    className={styles.input}
                    type="text"
                    placeholder='Digite o valor do Produto'
                    value={price}
                    onChange={(e)=>setPrice(e.target.value)} 
                    />
                    <textarea
                    className={styles.input}
                    placeholder='Descreva seu produto...'
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    />

                    <button className={styles.buttonAdd} type='submit'>
                        Cadastrar
                    </button>
                </form>
            </div>
        </main>

        </>
    )
}

export const getServerSideProps = canSSRAuth(async(ctx)=>{
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/category');
    //console.log(response.data);
    return{
        props:{
            categoryList: response.data
        }
    }
});