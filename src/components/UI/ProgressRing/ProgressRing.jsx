import React, { useEffect, useRef } from "react";
import "./ProgressRing.css";

const RADIUS = 130;
const circumference = 2 * Math.PI * RADIUS;

const ProgressRing = ({ countdown }) => {
  const progressRingRef = useRef(null);

  useEffect(() => {
    if (!progressRingRef.current) return;
    const maxCountdown = 5;
    const clamped = Math.max(0, Math.min(countdown, maxCountdown));
    const progress = (maxCountdown - clamped) / maxCountdown;
    const offset = circumference * (1 - progress);
    progressRingRef.current.style.strokeDashoffset = offset;
  }, [countdown]);

  return (
    <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px] aspect-square">
      <div className="wrapper">
        <svg
          className="progress-svg"
          viewBox="0 0 300 300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="ringRadialGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,1)" />
              <stop offset="100%" stopColor="rgba(234,255,0,1)" />
            </radialGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g transform="rotate(-90 150 150)">
            <circle
              cx="150"
              cy="150"
              r={RADIUS}
              stroke="#ffffff"
              strokeWidth="4"
              fill="none"
              opacity="0.35"
            />
            <circle
              cx="150"
              cy="150"
              r={RADIUS}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="14"
              fill="none"
            />
            <circle
              ref={progressRingRef}
              className="progress-ring"
              cx="150"
              cy="150"
              r={RADIUS}
              fill="none"
              stroke="url(#ringRadialGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              style={{ filter: "url(#glow)" }}
            />
          </g>
        </svg>
      </div>
      <div className="center-text aman">
        <p className="text-xl leading-[35px] pb-2 sm:text-2xl font-bold sm:leading-[50px] text-orange-dark border-b border-white w-[150px] sm:pb-3">
          Next Round
        </p>
        <span className="text-md2 sm:text-[25px] font-normal">{`BETS ${countdown}`}</span>
      </div>
    </div>
  );
};

export default ProgressRing;
