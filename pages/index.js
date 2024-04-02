import Image from "next/image";
import { DM_Sans } from "next/font/google";
import Time from "@/components/Timerleft";
import TimeRight from "@/components/Timer";
import HeaderText from "@/components/HeaderText";
import Dice from 'react-dice-roll';
import Cookie from 'js-cookie';

const inter = DM_Sans({ subsets: ["latin"] });

export default function Home() {

  const handleLogout = () => {
    Cookies.remove('refreshtoken', { path: '/api/auth/refreshToken' })
    localStorage.removeItem('firstLogin')
    dispatch({ type: 'AUTH', payload: {} })
    router.push('/')
  }

  return (
    <div className="h-screen w-screen absolute overflow-hidden">
      <div className="flex justify-center w-full bg-black">
        <h1 className="text-center text-white text-2xl p-4">Dice🎲</h1>
        <img src="/close.png" onClick={handleLogout} className="h-8 mb-8  ml-auto " />
      </div>


      <main
        className={'grid grid-cols-3 w-full absolute h-screen overflow-hidden'}
      >
        <div className="">
          <Time />

        </div>
        <div className="  scale-50 h-56 flex justify-center">
        <Dice onRoll={(value) => console.log(value)} />
        </div>
        <TimeRight />
      </main>
    </div>
  );
}
