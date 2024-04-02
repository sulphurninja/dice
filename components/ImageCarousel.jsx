import { useState, useEffect } from 'react';

const images = [
  '/BLACK 1.png',
  '/BLACK 2.png',
  '/BLACK 3.png',
  '/wow.png',
  '/wow2.png',
  '/6.png',
  '/7.png',
  '/8.png'
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const [timeToDraw, setTimeToDraw] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nextMinute = new Date(now.getTime() + 60 * 1000);
      const timeToNextMinute = 60 - nextMinute.getSeconds();
      setTimeToDraw(timeToNextMinute);
      if (!isStopped) {
        setCurrentIndex((currentIndex) =>
          currentIndex === images.length - 1 ? 0 : currentIndex + 1
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isStopped]);

  useEffect(() => {
    if (timeToDraw <= 1 || timeToDraw >= 58) {
      setIsStopped(false);
    } else setIsStopped(true);
  }, [timeToDraw]);

  const handleStop = () => {
    setIsStopped(true);
  };

  return (
    <div  style={{
      cursor: "pointer",
      position: "absolute",
      width: "45%",
      height: "40%",
      left: "40%",
      top: "40%",
      margin: "0 auto",

 
    }} className="absolute w-12  z-50  overflow-hidden">
   
      {images.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`Image ${index}`}
          className={`image-carousel-item z-50 h-14 absolute   ${
            currentIndex === index ? 'active' : ''
          } ${!isStopped ? 'running' : ''}`}
          style={{
            animationDelay: `-${index * 1}s`, // Adjust the delay based on the index
          }}
          onAnimationEnd={() => handleStop()}
        />
      ))}
    </div>
  );
}
