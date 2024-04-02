import React, { useState, useEffect, useRef } from "react";
import { getRotationDegrees } from "../utils";
import styled from "styled-components";
const STARTED_SPINNING = "started-spinning";
const START_SPINNING_TIME = 800;
const CONTINUE_SPINNING_TIME = 400;
const STOP_SPINNING_TIME = 4000;

interface Roulette {
  startSpinningTime: number;    
  continueSpinningTime: number;
  stopSpinningTime: number;
  startRotationDegrees: number;
  className?: string;
  children?: React.ReactNode;
  finalRotationDegrees: number;
}

interface Wheeel{
  mustStartSpinning: number;
  prizeNumber: number;
  onClick: any,
  onStopSpinning: any
}

export const RotationContainer = styled.div<Roulette>`
  position: absolute;
  will-change: transform;
  width: 100%;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(${(props) => props.startRotationDegrees}deg);
  &.started-spinning {
    animation: spin ${({ startSpinningTime }) => startSpinningTime / 1000}s
        cubic-bezier(0.71, -0.29, 0.96, 0.9) 0s 1 normal forwards running,
      continueSpin 0.75s linear
        ${({ startSpinningTime }) => startSpinningTime / 1000}s 1 normal
        forwards running,
      stopSpin ${({ stopSpinningTime }) => stopSpinningTime / 1000}s
        cubic-bezier(0, 0, 0.35, 1.02)
        ${({ startSpinningTime, continueSpinningTime }) =>
          (startSpinningTime + continueSpinningTime) / 1000}s
        1 normal forwards running;
  }
  @keyframes spin {
    from {
      transform: rotate(${(props) => props.startRotationDegrees}deg);
    }
    to {
      transform: rotate(${(props) => props.startRotationDegrees + 360}deg);
    }
  }
  @keyframes continueSpin {
    from {
      transform: rotate(${(props) => props.startRotationDegrees}deg);
    }
    to {
      transform: rotate(${(props) => props.startRotationDegrees + 360}deg);
    }
  }
  @keyframes stopSpin {
    from {
      transform: rotate(${(props) => props.startRotationDegrees}deg);
    }
    to {
      transform: rotate(${(props) => 1440 + props.finalRotationDegrees}deg);
    }
  }
`;

 const Wheel = ({ mustStartSpinning, prizeNumber,
  onClick = () => null,
  onStopSpinning = () => null
}: Wheeel) => {
  const [startRotationDegrees, setStartRotationDegrees] = useState(0);
  const [finalRotationDegrees, setFinalRotationDegrees] = useState(0);
  const [hasStartedSpinning, setHasStartedSpinning] = useState(false);
  const [hasStoppedSpinning, setHasStoppedSpinning] = useState(false);
  const [isCurrentlySpinning, setIsCurrentlySpinning] = useState(false);
  const mustStopSpinning = useRef(false);

  const startSpinning = () => {
    setHasStartedSpinning(true);
    setHasStoppedSpinning(false);
    mustStopSpinning.current = true;
    setTimeout(() => {
      if (mustStopSpinning.current) {
        mustStopSpinning.current = false;
        setHasStartedSpinning(false);
        setHasStoppedSpinning(true);
        onStopSpinning();
      }
    }, START_SPINNING_TIME + CONTINUE_SPINNING_TIME + STOP_SPINNING_TIME - 300);
  };

  useEffect(() => {
    if (mustStartSpinning && !isCurrentlySpinning) {
      setIsCurrentlySpinning(true);
      startSpinning();
      const finalRotationDegreesCalculated = getRotationDegrees(
        prizeNumber,
        10
      );
      setFinalRotationDegrees(finalRotationDegreesCalculated);
    }
  }, [mustStartSpinning]);

  useEffect(() => {
    if (hasStoppedSpinning) {
      setIsCurrentlySpinning(false);
      setStartRotationDegrees(finalRotationDegrees);
    }
  }, [hasStoppedSpinning]);

  const getRouletteClass = () => {
    if (hasStartedSpinning) {
      return STARTED_SPINNING;
    }
    return "";
  };

  return (
    <>

        <RotationContainer
          className={getRouletteClass()}
          startSpinningTime={START_SPINNING_TIME}
          continueSpinningTime={CONTINUE_SPINNING_TIME}
          stopSpinningTime={STOP_SPINNING_TIME}
          startRotationDegrees={startRotationDegrees}
          finalRotationDegrees={finalRotationDegrees}
        >
          <img
            src="/wheel2.png"
            alt="wheel"
            style={{ position: "absolute",
              width: "88%",
              height: "88%",
              margin: "0 auto",
              objectFit:"contain",
            }}
          />
        </RotationContainer>

        {/* <div> 
          <img src='' />
        </div> */}
</>
  );
};

export default Wheel
