import { GetServerSideProps } from "next";
import Head from 'next/head'
import { useEffect, useState } from "react";
import { Card } from "../../../../components/Card";
import { FaTrashAlt, FaThumbsDown, FaThumbsUp } from 'react-icons/fa'
import { increaseCount, decreaseCount, clearSellValues } from "../../../../controllers/menuController";
import { CheckoutModal } from "../../../../components/modals/CheckoutModal";
import { Dish, SelectedDishes } from "../../../../interfaces/DishInterface";
import projectLayout from "../../../../layouts/projectLayout";
import { useRouter } from "next/router";
const classes = require('../../../../styles/tooltip.module.css');

type SellProps = {
    role: string,
    userId: string,
    userName: string,
    items: Dish[],
    token: string,
}

const sell = ({ role, userId, userName, items, token }: SellProps) => {
    const router = useRouter();
    const [dishCounters, setDishCounters] = useState(() => items.map((x: Dish) => 0));
    const [selectedDishes, setSelectedDishes] = useState<SelectedDishes[]>([]);
    const [totalDishes, setTotalDishes] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showModal, setShowModal] = useState<string>('hidden'); // 'hidden' to have the modal closed and '' to open it
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {

        } else {
            if (showModal === 'hidden') {
                clearSellValues(setDishCounters, setTotalDishes, setSelectedDishes, setTotalPrice);
            }
        }
        setLoaded(true);
    }, [showModal])
    if (!role) {
        return (<>{router.locale === 'en' ? 'You need to be logged in to see this page' : 'Necesita estar registrado para ver esta pagina'}</>)
    } else {
        return (
            <>
                <Head>
                    <title>{role !== 'user' ? router.locale === 'en' ? 'Buy' : 'Comprar' : router.locale === 'en' ? 'Catalog' : 'Catalogo'}</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className={showModal === '' ? 'pointer-events-none' : ''}>
                    <section>
                        <h1 className="text-2xl">{role !== 'user' ? router.locale === 'en' ? 'Buy' : 'Comprar' : router.locale === 'en' ? 'Catalog' : 'Catalogo'}</h1>
                        <br />
                        <div className='inline-block xl:mx-2'>
                            {
                                items.map((item: Dish, i: number) => {
                                    return (
                                        <div key={`card` + i} className="inline-block xl:mx-2">
                                            <div onClick={() => increaseCount(i, item, dishCounters[i], dishCounters, setDishCounters, totalDishes, setTotalDishes, selectedDishes, setSelectedDishes, totalPrice, setTotalPrice)} className={`${classes.tooltip} cursor-pointer hover:border-4 hover:border-cyan-600`}>
                                                <span className={classes.tooltiptext}>{router.locale === 'en' ? 'Add' : 'Añadir'}</span>
                                                <Card item={item} />
                                            </div>
                                            <br />
                                            <button onClick={() => decreaseCount(i, item, dishCounters[i], dishCounters, setDishCounters, totalDishes, setTotalDishes, selectedDishes, setSelectedDishes, totalPrice, setTotalPrice)}
                                                className="inline-block xl:mx-2 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                                                style={{ width: "100%" }}
                                            >
                                                <FaTrashAlt className="inline-block xl:mx-2" />
                                            </button>
                                            <br />
                                            <p>{dishCounters[i]}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </section>
                    <br />
                    <section>
                        <p>{router.locale === 'en' ? 'Info' : 'Informacion'}</p>
                        <div className='inline-block mx-2'>
                            <table className="table-auto border-2 inline-block mx-2">
                                <thead>
                                    <tr className="border-2">
                                        <th className="border-2">#</th>
                                        <th className="border-2">{router.locale === 'en' ? 'Dish' : 'Platillo'}</th>
                                        <th className="border-2">{router.locale === 'en' ? 'Quantity' : 'Cantidad'}</th>
                                        <th className="border-2">{router.locale === 'en' ? 'Price' : 'Precio'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        selectedDishes?.map((item: SelectedDishes, i: number) => {
                                            // const index = items.indexOf(item); // as the counter state position of the items is based in the items array, we need to get the position in that variable, else the render won't find what to render
                                            const indexArray = items.map((OldItem: Dish, i: number) => {
                                                if (OldItem!.name === item.name) {
                                                    return i;
                                                }
                                            })
                                            const index: any = indexArray.filter((x: any) => { return x !== undefined })
                                            return (
                                                dishCounters[index] > 0
                                                    ?
                                                    <tr key={`selected` + i} className="border-2">
                                                        <td className="border-2">{i + 1}</td>
                                                        <td className="border-2">{item!.name}</td>
                                                        <td className="border-2">{dishCounters[index]}</td>
                                                        <td className="border-2">${dishCounters[index] * item!.price}</td>
                                                    </tr>
                                                    : undefined
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <br />
                            <br />
                            <table className="table-auto border-2">
                                <thead>
                                    <tr className="border-2">
                                        <th className="border-2">{router.locale === 'en' ? 'Total Dishes' : 'Total de platos'}</th>
                                        <th className="border-2">{router.locale === 'en' ? 'Total Payment' : 'Total a pagar'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-2">
                                        <td className="border-2">
                                            {totalDishes}
                                        </td>
                                        <td className="border-2">
                                            ${totalPrice}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <br />
                        <br />
                        <button
                            className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                        >
                            <FaThumbsDown className="inline-block mx-2" /> {router.locale === 'en' ? 'Cancel' : 'Cancelar'}
                        </button>
                        <button
                            // onClick={() => processTransaction(totalPrice, totalDishes, token, userId, undefined, selectedDishes, dishCounters, items)}
                            onClick={() => setShowModal('')}
                            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                            style={{ marginLeft: "2vw" }}
                        >
                            <FaThumbsUp className="inline-block mx-2" /> {router.locale === 'en' ? 'Submit' : 'Procesar'}
                        </button>
                    </section>
                </div>
                <CheckoutModal
                    showModal={showModal} //Replace showModal with 'true' to open the modal for modifications
                    setShowModal={setShowModal}
                    token={token}
                    role={role}
                    totalPrice={totalPrice}
                    totalDishes={totalDishes}
                    userId={userId}
                    customer={''}
                    selectedDishes={selectedDishes}
                    dishCounters={dishCounters}
                    items={items}
                    locale={router.locale}
                />
            </>
        )
    }
}

export default sell;

sell.Layout = projectLayout;

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const res = await fetch(`${process.env.managementBackend}/api/v1/menu/forToday?limit=10`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                Authorization: 'Bearer ' + context.req.cookies.token
            }
        });

        const items = await res.json();

        // console.log(items)

        return {
            props: {
                items: items.data,
                role: context.req.cookies.role ?? null,
                userId: context.req.cookies.userId ?? null,
                userName: context.req.cookies.userName ?? null,
                token: context.req.cookies.token ?? null,
            }
        }
    } catch (error) {
        return {
            notFound: true
        }
    }
}
