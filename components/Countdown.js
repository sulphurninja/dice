import { useState, useEffect, useContext } from "react";
import React from "react";
import { DataContext } from "@/store/GlobalState";
import Cookie from 'js-cookie';

import ResultsTable from '../components/ResultsTable'
import { useRouter } from "next/router";

export default function Countdown({ props: clickedButton }) {
    const [time, setTime] = useState(new Date());
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const [couponNum, setCouponNum] = useState();
    // const [showClickedButton, setShowClickedButton] = useState(true);

    // useEffect(() => {
    //     // When couponNum changes, hide the clickedButton div
    //     setShowClickedButton(false);

    //     // When a new clickedButton prop is received, display the clickedButton div again
    //     if (clickedButton !== null && clickedButton !== undefined) {
    //         setShowClickedButton(true);
    //     }
    // }, [couponNum, clickedButton]);


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

    const [showClickedButton, setShowClickedButton] = useState(true);

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
    const nextToDrawtime = nextToDraw.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });


    useEffect(() => {
        const fetchWinningNumber = async (userName) => {
            if (timeToDraw >= 0) {
                try {
                    const response = await fetch(
                        `/api/getWinningNumber?userName=${encodeURIComponent(userName)}&drawTime=${encodeURIComponent(nextToDrawtime)}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setCouponNum(data.couponNum);
                        console.log(data.couponNum, "this is the fetched result");
                    } else {
                        console.log("Error fetching winning number:", response.statusText);
                    }
                } catch (err) {
                    console.log("Error fetching winning number:", err);
                }
            }
        };

        console.log(userName, 'username whats');
        fetchWinningNumber(userName); // Call immediately on mount

        const timer = setInterval(() => {
            fetchWinningNumber(userName);
        }, 20000);

        return () => clearInterval(timer);
    }, [nextToDrawtime, timeToDraw]);

    return (
        <>
            <h1 className="text-5xl mt-4 rounded-full w-1/2 flex justify-center text-center bg-white text-black ">{couponNum}</h1>
        <div className="text-2xl grid grid-cols-3 gap-x-4 mt-32 mx-12   ">
            <div>
                <img src="/timer.png" className="h-20 mt-auto  rounded-sm" />
                <p className="-mt-14 text-4xl  text-white ml-4 font-mono">
                    {timeToDraw}
                </p>
            </div>
            {showClickedButton && (
                <div className="h-14 ml-12 w-14 bg-green-600 mt-4 rounded-full my-auto">
                    <h1 className="text-4xl text-white ml-4 my-auto">{clickedButton}</h1>
                </div>
            )}
        </div>
        </>
    );
}
