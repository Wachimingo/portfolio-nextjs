import { FaAngleUp, FaTrash, FaCog, FaRegFolderOpen, FaStar } from "react-icons/fa";
import { deleteItem, changeStateOfItem, updateItem, setAsFavorite, removeFavorite } from '../controllers/menuController';
import Link from 'next/link'
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dish, Favs, Order } from "../interfaces/DishInterface";
import { updateStatus } from "../controllers/ordersController";
const classes = require('../styles/catalog.module.css');

const toggleCard = (id: string) => {
    document.getElementById(`itemBody_${id}`)?.classList.toggle(`${classes.itemIsForToday}`)
    document.getElementById(`activate_${id}`)?.classList.toggle(`${classes.isActive}`)
}

const toggleStar = (id: string) => {
    document.getElementById(`star_${id}`)?.classList.toggle(`${classes.isFavorite}`)
}

type CardProps = {
    item: Dish,
}

export const Card = ({ item }: CardProps) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg" style={{ width: "25vw" }}>
            <img className="w-full" id={`img_${item?._id}`} src={`${item?.image}`} alt={item?.name} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2" id={`title_${item?._id}`}>{item?.name}</div>
                <p className="text-gray-700 text-base text-sm" id={`description_${item?._id}`}>
                    {item?.description}
                </p>
                <p className="text-gray-700 text-base" id={`price_${item?._id}`}>
                    ${item?.price}
                </p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{item?.category?.name}</span>
            </div>
        </div>
    )
}

type ControlButtonsProps = {
    token: string,
    item: Dish,
    favs: any, // setting Favs[] throw an error as it doesn't have the .include() method
    setItem: Function,
    setShowModal: Function,
    _id: string
}

export const ControlButtons = ({ token, item, favs, setItem, setShowModal, _id }: ControlButtonsProps) => {
    const [state, setState] = useState(item!.forToday)
    return (
        <div>
            <span
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Eliminar"
                className={`inline-block  ${classes.controlButtons}`}
                onClick={() => deleteItem(item!._id, token)}>
                <FaTrash />
            </span>
            <span
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Modificar"
                className={`inline-block  ${classes.controlButtons}`}
                onClick={() => updateItem(item, setShowModal, setItem)}>
                <FaCog />
            </span>
            <span
                id={`activate_${item?._id}`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={item?.forToday ? "Desactivar" : "Activar"}
                className={item?.forToday ? `inline-block  ${classes.controlButtons} ${classes.isActive}` : `inline-block  ${classes.controlButtons}`}
                onClick={() => changeStateOfItem(item!._id, state, token, toggleCard(item!._id), setState(!state))}>
                <FaAngleUp />
            </span>
            <span data-bs-toggle="tooltip" data-bs-placement="top" title="Review" className={`inline-block  ${classes.controlButtons}`}>
                <Link href={`/projects/comedor/menu/review/${item?._id}`} passHref>
                    <a><FaRegFolderOpen /></a>
                </Link>
            </span>
            <span
                id={`star_${item?._id}`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Marcar como favorito"
                className={favs.includes(item!._id) ? `inline-block  ${classes.controlButtons} ${classes.isFavorite}` : `inline-block  ${classes.controlButtons}`}
                onClick={() => {
                    favs.includes(item!._id)
                        ?
                        removeFavorite(item!._id, _id, token, toggleStar(item!._id))
                        :
                        setAsFavorite(item!._id, _id, token, toggleStar(item!._id))
                }}>
                <FaStar />
            </span>
        </div>
    )
}
type OrderCardProps = {
    order: Order,
    role: string,
    token: string
}

export const OrderCard = ({ order, role, token }: OrderCardProps) => {
    const t = useTranslations("OrderCard")
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg card inline-block mx-2" style={{ width: "25vw" }} key={'order' + order._id}>
            <div className="px-6 py-4">
                {
                    role === 'admin'
                        ?
                        <div className="font-bold text-xl mb-2" >
                            <h5>
                                {t("submitter")} {order.user.name}
                            </h5>
                        </div>
                        : undefined
                }

                <p className="text-gray-700 text-base text-sm" >
                    {t("totalDishes")} {order.totalDishes}
                </p>
                <p className="text-gray-700 text-base" >
                    {t("price")}: ${order.totalPrice}
                </p>
                <p className="text-gray-700 text-base" >
                    {t("date")}: {order.createdAt}
                </p>
                {
                    order.status === 'isPending'
                        ?
                        <p className="text-red-700 text-base" >
                            <span className="text-gray-700">{t("state")}:</span> {t("pending")}
                        </p> : undefined
                }
                {
                    order.status === 'isReady'
                        ?
                        <p className="text-green-700 text-base" >
                            <span className="text-gray-700">{t("state")}:</span> {t("ready")}
                        </p> : undefined
                }
                {
                    order.status === 'completed'
                        ?
                        <p className="text-black text-base" >
                            <span className="text-gray-700">{t("state")}:</span> {t("completed")}
                        </p> : undefined
                }
                <p className={`text-base ${order.isPaid ? 'text-green-700' : 'text-red-700'}`} >
                    {order.isPaid ? t("payed") : t("paymentPending")}
                </p>
            </div>
            <ul className="text-left">
                {
                    order.body.map((dish: any, j: number) => {
                        return (
                            <li key={"dishName" + j}>{dish.name}</li>
                        )
                    })
                }
            </ul>
            <br />
            <OrderControls role={role} token={token} orderId={order._id} currentStatus={order.status} />
            <br />
        </div>
    )
}

export const OrderControls = ({ role, token, orderId, currentStatus }: any) => {
    const t = useTranslations("OrderControls")
    return (
        <div>
            {
                role !== 'user'
                    ?
                    currentStatus === "completed" ? undefined
                        :
                        <button
                            onClick={() => currentStatus === "isPending" ? updateStatus(token, orderId, 'isReady') : updateStatus(token, orderId, 'completed')}
                            className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                        >
                            {currentStatus === "isPending" ? t("ready") : t("complete")}
                        </button> : undefined
            }

            <button
                // onClick={() => processTransaction(props.totalPrice, props.totalDishes, props.token, props.userId, props.customer, props.selectedDishes, props.dishCounters, props.items)}
                className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                style={{ marginLeft: "2vw" }}
            >
                {t("cancel")}
            </button>
        </div>
    )
}