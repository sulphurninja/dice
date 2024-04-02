import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { DataContext } from '../store/GlobalState'
import  Cookie  from 'js-cookie'

function Easylogout() {
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
    const router = useRouter()
  
    const isActive = (r) => {
      if(r=== router.pathname){
        return " active"
      }else{
        return ""
      }}
  
  const handleLogout=()=>{
    Cookie.remove('refreshtoken', {path:'api/auth/accessToken'})
    localStorage.removeItem('firstLogin')
    dispatch({type:'AUTH', payload:{}})
    router.push('/login')
  }
  
  
    const loggedRouter = () => {
      return(
      <div className='bg-green-200 w-[100px] mt-[30px] ml-[30px] '>
        <h1>{auth.user.userName}</h1>
        <button className=' font-[30px]' onClick={handleLogout}>Logout</button>
      </div>
      )
    }

  return (
    <div>
    {
        Object.keys(auth).length === 0
          ? <li className='bg-green-200 w-[40px]'>
            Login
          </li>
          : loggedRouter()
      }
    </div>
  )
}

export default Easylogout