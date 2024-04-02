import { useState, useEffect } from 'react';

function Buttons() {


  return (
    <div className='grid grid-cols-3  text-sm mt-4'>
      <div className='bg-[#690502] w-20 md:w-28 shadow-[#9B5143] shadow-[1px_0px_3px_0px_#00000024] ml-2 '>
        <h1 className='text-center  text-white'>0</h1>
        <div className='bg-[#1F0000]  w-20 md:w-28 '>
          <h1 className='text-center  text-white'>BALANCE</h1>

        </div>
      </div>
      <div className='bg-[#690502] w-20 md:w-28 md:ml-24 ml-16  shadow-[#9B5143] shadow-[1px_0px_3px_0px_#00000024]  '>
        <h1 className='text-center  text-white'>0</h1>
        <div className='bg-[#1F0000]  w-20 md:w-28'>
          <h1 className='text-center  text-white'>TOTAL BET</h1>
        </div>
      </div>

      <div className='bg-[#690502] w-20 ml-32 md:ml-44 md:w-28 shadow-[#9B5143] shadow-[1px_0px_3px_0px_#00000024]  '>
        <h1 className='text-center  text-white'>0</h1>
        <div className='bg-[#1F0000] w-20 md:w-28 '>
          <h1 className='text-center  text-white'>WINNING</h1>
        </div>
      </div>
      
    </div>
  );
}

export default Buttons;
