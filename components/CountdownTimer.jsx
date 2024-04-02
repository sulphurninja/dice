import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ onTimeUp }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const bettingStartTime = new Date(2023, 1, 7, 10, 0, 0); // 10:00 AM, February 7, 2023
    const now = new Date();
    const minutesSinceStart = (now - bettingStartTime) / (1000 * 60);
    const nextDrawMinutes = Math.ceil(minutesSinceStart / 1) * 1;
    const nextDrawTime = new Date(bettingStartTime.getTime() + nextDrawMinutes * 60 * 1000);

    const intervalId = setInterval(() => {
      const now = new Date();
      if (now >= nextDrawTime) {
        const minutesSinceStart = (now - bettingStartTime) / (1000 * 60);
        const nextDrawMinutes = Math.ceil(minutesSinceStart / 1) * 1;
        const nextDrawTime = new Date(bettingStartTime.getTime() + nextDrawMinutes * 60 * 1000);
        setTimeRemaining(Math.floor((nextDrawTime - now) / 1000));
      } else {
        setTimeRemaining(Math.floor((nextDrawTime - now) / 1000));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  

  useEffect(() => {
    if (timeRemaining === 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  const seconds = (timeRemaining % 60).toString().padStart(2, '0');

  return (
    <div className='text-green-200 bg-red-800 w-[80px] h-[80px] text-center border-white border-b-2 rounded-full  absolute  '>
      <h1 className='font-bold font-mono  text-[30px] mt-[15px] '>{seconds}</h1>
    </div>
  );
};

export default CountdownTimer;
