// const BalloonIcon = ({
//   width = "244px",
//   height = "294px",
//   fill = "#0679FD",
//   label = "1.00x",
//   left = "",
//   top="30"

// }) => {
//   return (
//     <div className="m-auto relative"
//       style={{
//         top:`${top}px`,
//         left:`${left}px`,
//         width, height
//       }} // only keep size (optional)
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="100%"
//         height="100%"
//         viewBox="0 0 244 295"
//         fill="none"
//       >
//         <path d="M244 122C244 189.379 189.379 268 122 268C54.6213 268 0 189.379 0 122C0 54.6213 54.6213 0 122 0C189.379 0 244 54.6213 244 122Z" fill={fill} />
//         <rect x="106" y="257" width="33" height="38" fill={fill} />
//         <ellipse cx="178.374" cy="45.9302" rx="19" ry="12.5" transform="rotate(23 178.374 45.9302)" fill="white" />
//         <g filter="url(#filter0_d_141_2455)">
//           <text
//             x="122"
//             y="150"
//             textAnchor="middle"
//             dominantBaseline="middle"
//             fill="white"
//             fontSize="60"
//             fontWeight="700"
//           >
//             {label}
//           </text>
//         </g>
//         <defs>
//           <filter id="filter0_d_141_2455" x="38.5374" y="120.6" width="172.331" height="69.6" filterUnits="userSpaceOnUse">
//             <feFlood floodOpacity="0" result="BackgroundImageFix" />
//             <feColorMatrix
//               in="SourceAlpha"
//               type="matrix"
//               values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
//               result="hardAlpha"
//             />
//             <feOffset dx="2" dy="9" />
//             <feGaussianBlur stdDeviation="6.3" />
//             <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" />
//             <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_141_2455" />
//             <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_141_2455" result="shape" />
//           </filter>
//         </defs>
//       </svg>
//     </div>
//   );
// };

// export default BalloonIcon;


import { motion } from "framer-motion";

export default function BalloonIcon({fill}) {
  return (
    <motion.svg
      viewBox="0 0 600 400"
      style={{ width: "120px", height: "200px" }}
    >
      <motion.path
        d="
          M100 330
          L100 200
          Q100 100 150 80
          Q220 80 260 120
          Q290 160 300 200
        "
        // stroke="#E9113B"
        stroke={fill}
        strokeWidth="135"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 0.65,
          ease: 'easeInOut',
        }}
      />
    </motion.svg>
  );
}
