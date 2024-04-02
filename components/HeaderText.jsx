import React, { useContext } from 'react'
import Cookie from 'js-cookie';
import { DataContext } from '@/store/GlobalState';
import { useRouter } from 'next/router';

function HeaderText() {
 
  const { state = {}, dispatch } = useContext(DataContext)
  const { auth = {} } = state

  const router = useRouter();

  const handleLogout = () => {
    Cookie.remove('refreshtoken', { path: '/api/auth/refreshToken' })
    localStorage.removeItem('firstLogin')
    dispatch({ type: 'AUTH', payload: {} })
    router.push('/login')
  }

  return (
    <div className='flex ml-[5%]  '>
      <div className='border-8 h-[30%] w-[30%] lg:h-[30%] lg:w-[30%]  border-dotted  rounded-lg ml-auto mr-auto text-center border-amber-400'>
        <img src='/fun.png' className='h-[100%] w-[100%] ' />
      </div>
      <div className=' '>

      <img src='/close.png' onClick={handleLogout} className='h-[100%] cursor-pointer lg:h-[60%] lg:w-[100%] w-[100%]' />
      </div>
    </div>

  )
}

export default HeaderText
