import { useState, useEffect, useContext } from 'react';
import BetOk from './BetOK';
import { DataContext } from '@/store/GlobalState';

function ResultsTable() {
  const [results, setResults] = useState([]);
  const [drawTimes, setDrawTimes] = useState([]);
  const [nextToDrawtime, setNextToDrawtime] = useState('');
  const [timeToDraw, setTimeToDraw] = useState('');
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
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




  useEffect(() => {
    const fetchData = async () => {
      const startDrawTime = new Date();
      startDrawTime.setMinutes(Math.floor(startDrawTime.getMinutes() / 1) * 1);
      startDrawTime.setSeconds(0);

      const drawTimes = Array(10).fill().map((_, index) => {
        const drawTime = new Date(startDrawTime.getTime() - index * 1 * 60 * 1000);
        return drawTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      });

      setDrawTimes(drawTimes);

      const resultsData = await Promise.all(drawTimes.map(async (drawTime) => {
        const response = await fetch(`/api/getWinningNumber?drawTime=${encodeURIComponent(drawTime)}&userName=${encodeURIComponent(userName)}`);
        console.log(userName, 'whats result username')
        if (response.ok) {
          const result = await response.json();
          return result.couponNum;
        } else {
          console.log(`Error fetching winning number for draw time ${drawTime}: ${response.statusText}`);
          return null;
        }
      }));

      setResults(resultsData);
    };

    const fetchDataInterval = setInterval(() => {
      fetchData(); // Fetch every 30 seconds
    }, 10000);

    fetchData(); // Fetch immediately on mount

    const timer = setInterval(() => {
      const now = new Date();
      const nextToDraw = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes() + 1,
        0,
        0
      );
      const timeDiff = Math.floor((nextToDraw - now) / 1000);
      const seconds = timeDiff % 60;
      const newTimeToDraw = `${seconds.toString().padStart(2, "0")}`;
      const newNextToDrawtime = nextToDraw.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setNextToDrawtime(newNextToDrawtime);
      setTimeToDraw(newTimeToDraw);
    }, 1000);

    return () => {
      clearInterval(fetchDataInterval);
      clearInterval(timer);
    };
  }, [userName]); // Re-run effect whenever userName changes

  return (
    <div className='ml-20 mt-[36%]'>
      <div className="  ">
        <div className="flex ">
          {drawTimes.map((drawTime, index) => (
            <div key={drawTime} className="">
              <div className="bg-[#CD1D1E] text-white font-bold px-[3px] text-center S border border-white -300">
                {results[index]}
              </div>
              <div className="bg-[#CD1D1E] text-white font-bold text-xs px-[3px] text-center  border border-white -300">
                1X
              </div>
            </div>
          )).reverse()}
        </div>
      </div>
      <div className='flex mt-3 -ml-12 gap-2'>
        <img src='/prev.png' className='h-6' />
        <img src='/clear.png' className='h-6' />
        <img src='/double.png' className='h-6' />
      </div>
    </div>
  );
}

export default ResultsTable;
