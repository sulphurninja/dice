import { DataContext } from '@/store/GlobalState';
import Head from 'next/head';
import Link from 'next/link'
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import Modal from '../components/ModalResult'
import Countdown from './Countdown';

function game() {
    const [couponNum, setCouponNum] = useState(1);
    const [mustSpin, setMustSpin] = useState(false);
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState(new Date());
    const [spinning, setSpinning] = useState(false);
    const [message, setMessage] = useState('');
    const [showModalResult, setShowModalResult] = useState(false);
    const [couponNums, setCouponNums] = useState(Array(10).fill(null));
    const [clickedButton, setClickedButton] = useState(null);

    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const router = useRouter();

    const [userName, setUserName] = useState(auth && auth.user && auth.user.userName ? auth.user.userName : "");




    useEffect(() => {
        if (auth && auth.user && auth.user.userName) {
            // Update state and localStorage when user is authenticated
            setUserName(auth.user.userName);
            localStorage.setItem("userName", auth.user.userName);
        }
    }, [auth]);

    useEffect(() => {
        // Retrieve username from localStorage on component mount
        const storedUserName = localStorage.getItem("userName");
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);


    const handleChange = event => {
        setMessage(event.target.value);
        if (!spinning) {
            setSpinning(true);
            const newCouponNum = event.target.value - 1 || Math.random;
            setCouponNum(newCouponNum);
            console.log(newCouponNum);
            setMustSpin(true);
        }

        console.log('value is:', event.target.value + 1);
    };



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


    const handleButtonClick = async (index) => {
        try {
            const response = await fetch('/api/updateWinningNumber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userName, // Assuming userName is available in the component state
                    couponNum: index,
                    nextToDrawtime: nextToDrawtime,
                }),
            });
            console.log(userName, 'subadmin username')
            const data = await response.json();
            console.log(data);
            if (data.success) {
                const newCouponNums = [...couponNums];
                newCouponNums[index] = index;
                setCouponNums(newCouponNums);
                setClickedButton(index); // Set the clicked button number
                setShowModalResult(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const buttonImages = [
        'button0.png',
        'button1.png',
        'button2.png',
        'button3.png',
        'button4.png',
        'button5.png',
        'button6.png',
        'button7.png',
        'button8.png',
        'button9.png',
    ];
    console.log(userName, 'subadmin username')


    const handleLogout = () => {
        Cookie.remove('refreshtoken', { path: '/api/auth/refreshToken' })
        localStorage.removeItem('firstLogin')
        dispatch({ type: 'AUTH', payload: {} })
        router.push('/subadminlogin')
    }


    return (
        <body className=''>
            <Head>
                <title>Fun Target Timer - Admin</title>
            </Head>
            <div className='ml-[30%] '>
                <h1 className='text-white font-fun'>ID:{userName}</h1>
            </div>
            <div className=' mt-3 bg-[#439300] border-[#912303] border-8 flex w-[100%] items-center justify-center  '>
                <div className='grid grid-cols-3 m-2 w-[100%] gap-4'>
                    {couponNums.map((number, index) => (
                        <button
                            key={index}
                            className='justify-center items-center flex bg-gray-300 rounded-full h-16'
                            onClick={() => handleButtonClick(index)}
                        >
                            <span className='text-2xl'>{index}</span>
                        </button>
                    ))}
                </div>
               

            </div>
            <div className='bg-black h-screen  absolute w-screen '>
                <div className=''>
                    <Countdown props={clickedButton} />

                </div>
            </div>
            {/* <Modal isOpen={showModalResult} onClose={() => setShowModalResult(false)} /> */}
        </body>

    )
}

export default game
