import { useState, useEffect, useContext } from "react";
import React from "react";
import { DataContext } from "@/store/GlobalState";
import Cookie from 'js-cookie';

import ResultsTable from '../components/ResultsTable'
import { useRouter } from "next/router";

export default function TimeRight() {
    const [time, setTime] = useState(new Date());
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state


    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);


    const nextToDraw = new Date(
        time.getFullYear(),
        time.getMonth(),
        time.getDate(),
        time.getHours(),
        time.getMinutes() + 1,
        0,
        0
    );

    const timeDiff = Math.floor((nextToDraw - time) / 1000);
    const seconds = timeDiff % 60;
    const timeToDraw = `${seconds.toString().padStart(2, "0")}`;
    const nextToDrawtime = nextToDraw.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const [userName, setUserName] = useState(auth && auth.user && auth.user.userName ? auth.user.userName : "");


    useEffect(() => {
        // Retrieve username from localStorage on component mount
        const storedUserName = localStorage.getItem("userName");
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    useEffect(() => {
        if (auth && auth.user && auth.user.userName) {
            // Update state and localStorage when user is authenticated
            setUserName(auth.user.userName);
            localStorage.setItem("userName", auth.user.userName);
        }
    }, [auth]);

    const router = useRouter();

    const handleLogout = () => {
        Cookie.remove('refreshtoken', { path: '/api/auth/refreshToken' })
        localStorage.removeItem('firstLogin')
        dispatch({ type: 'AUTH', payload: {} })
        router.push('/')
    }

    return (
        <div className="text-2xl   ">
            <h1 className="text-white text-end   mr-auto font-bold text-xs mt-1 ml-32 tracking-tighter uppercase w-fit bg-black/40 p-4 ">{userName}</h1>

            {/* <img src="/acc.png" onClick={handleLogout} className="h-5 mt-1 ml-auto rounded-sm" /> */}
            {/* <img src="/timer.png" onClick={handleLogout} className="h-14 ml-auto mt-1 rounded-sm" /> */}
            <p className="text-white mt-4 ml-[85%]  bg-red-600/70 rounded-full p-2   shadow-[#FBEDB8] text-center  text-2xl  flex  items-center">
                {timeToDraw}
            </p>
            <img src="/disclaimer.png" className="ml-auto h-14 mt-1 bg-black opacity-55" />


    
           





        </div>
    );
}
