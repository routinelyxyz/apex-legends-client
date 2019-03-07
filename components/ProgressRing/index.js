import './style.scss';
import { animated, useSpring } from 'react-spring';

export const ProgressRing = ({ radius, stroke, progress }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress / 100 * circumference;

  const props = useSpring({
    from: { strokeDashoffset: 365 },
    to: { strokeDashoffset }
  });

  // const dao = (277 * (100 - progress) / 100);

  const prog = useSpring({
    from: { progress: 0 },
    to: { progress },
    delay: 100
  });
 
  return (
    <svg
      height={radius * 2}
      width={radius * 2}
    >
      <defs>
        <linearGradient id="paint0_linear" x1="7.72414" y1="7.72414" x2="114.759" y2="128" gradientUnits="userSpaceOnUse">
          <stop stop-color="#9CECFB"/>
          <stop offset="0.546961" stop-color="#65C7F7"/>
          <stop offset="1" stop-color="#0052D4"/>
        </linearGradient>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00bc9b" />
          <stop offset="100%" stopColor="#5eaefd" />
        </linearGradient>
      </defs>
      <circle
        stroke="rgba(255,255,255,.025)"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <animated.circle
        strokeLinecap="round"
        stroke="url(#paint0_linear)"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{
          strokeDashoffset: prog.progress
            .interpolate(v => circumference - v / 100 * circumference)
        }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />

    </svg>
  )
}