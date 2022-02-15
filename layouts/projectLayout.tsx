import React, { useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import { useRouter } from "next/router"

const projectLayout = ({ children }: any) => {
    const router = useRouter();
    const [nav, setNav] = useState([]);

    useEffect(() => {
        getNav(router.pathname.split('/')[2]);
    }, [router.pathname.split('/')[2]])

    const getNav = async (project: string) => {
        const result = await fetch(`http://localhost:3000/api/navbar?project=${project}`, {
            method: 'GET'
        });
        const navItems: any = result.ok ? await result.json() : undefined;

        setNav(navItems);
    }

    return (
        <>
            <SideBar
                project={router.pathname.split('/')[2]}
                nav={nav}
            />

            {children}
        </>
    )
}

export default projectLayout;