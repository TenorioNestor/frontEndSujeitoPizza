import styles from './styles.module.scss'
import {Header} from  '../../components/Header'
import {setupAPIClient} from '../../services/api'
import Head from 'next/head'
import { canSSRAuth } from '../../utils/canSSRAuth'
import {useState} from 'react'
import Modal from 'react-modal'
import {ModalOrder} from './../../components/ModalOldOrder'
import {FiRefreshCcw} from 'react-icons/fi'

export type OrderItensProps = {
    id:string;
    amout:number | string;
    order_id:string;
    product_id:string;
    product:{
        id:string;
        name:string;
        price:string | number;
        description:string;
        banner:string;
    }
    order:{
        id:string;
        table:string | number;
        status:boolean;
        draft:boolean;
        name:string | null;
    }


}




type orderProps = {
    
    id:string;
    table:number | string;
    status:boolean;
    draft:boolean;
    name:string | null;
}

interface homeProps{
    orders: orderProps[];
}

export default function oldticket({orders}:homeProps){
    const [orderList, setorderList] = useState(orders || []);
    const [modalItem,setModalItem] = useState<OrderItensProps[]>();
    const [modalVisible, setModalVisible] = useState(false);


    function handleCloseModal(){
        setModalVisible(false);
    }

    async function handleFinishItem(id:string){
        const apiClient = await setupAPIClient();

        apiClient.put('/order/finish',{
            order_id:id,
        })

        const response = await apiClient.get('/old');

        setorderList(response.data)

        setModalVisible(false);

    }

    async function handleRefresh() {
        const apiClient = setupAPIClient();

        const response = await apiClient.get('/old');

        setorderList(response.data)
    }

    async function handleOpenModalView(id:string){
        const apiClient = setupAPIClient();
        const response = await apiClient.get('/order/detail',{
            params:{
                order_id:id,
            }
        })

        setModalItem(response.data);
        setModalVisible(true);
    }

    Modal.setAppElement('#__next');
    //console.log(orders)
    return(
        <>
            <Head>
                <title>Finalizados - Sujeito Pizzaria</title>
            </Head>
            <div>
                <Header/>
                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Pedidos finalizados</h1>
                        <button onClick={handleRefresh}>
                            <FiRefreshCcw size={25} color="#3fffa3"/>
                        </button>
                    </div>
                    <article className={styles.listOrders}>


                        {orderList.map(item =>(
                            <section key={item.id} className={styles.orderItem}>
                                <button onClick={()=> handleOpenModalView(item.id)}>
                                    <div className={styles.tag}></div>
                                    <span>Mesa {item.table}</span>
                                </button>
                            </section>
                        ))}
                        

                    </article>
                </main>
                
                {modalVisible && (
                    <ModalOrder
                    isOpen={modalVisible}
                    onRequestClose={handleCloseModal}
                    order={modalItem}
                    handleFinishOrder={handleFinishItem}
                    />
                )}

            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async(ctx) => {
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/old');

    //console.log(response.data);
    return {
        props:{orders:response.data}
    }
})