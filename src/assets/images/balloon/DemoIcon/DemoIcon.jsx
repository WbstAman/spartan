// import { motion, useAnimationControls } from "framer-motion";
// import { useEffect, useState } from "react";
// // import balloonSvg from "@/assets/svg/balloon.svg"; // apne hisaab se path change karo
// // import demoImg from "@/assets/demoImg.svg"
// import demoImg from "../../../demoImg.svg"


// export default function DemoIcon({ isFirstBet }) {
//   const controls = useAnimationControls();
//   const [spawned, setSpawned] = useState(false);

//   useEffect(() => {
//     if (isFirstBet && !spawned) {
//       controls.start("spawn");
//       setSpawned(true);
//     }
//   }, [isFirstBet, spawned]);

//   return (
//     <motion.img
//       src={demoImg}
//       alt="balloon"
//       className="w-[180px] h-auto"
//       style={{ transformOrigin: "center bottom" }} // tonti se nikalne wala effect
//       initial="hidden"
//       animate={controls}
//       variants={{
//         hidden: {
//               width: "451px",
//     height: "330px",
//           scale: 0,
//           y: 40,
//           opacity: 0,
//           filter: "drop-shadow(0 0 0px rgba(255,80,80,0))",
//         },
//         spawn: {
//           scale: [0, 1.35, 0.95, 1],
//           y: [40, -10, 0, 0],
//           opacity: [0, 1, 1, 1],
//           rotate: [0, -3, 2, 0],
//           filter: [
//             "drop-shadow(0 0 0px rgba(255,80,80,0))",
//             "drop-shadow(0 0 30px rgba(255,80,80,0.9))",
//             "drop-shadow(0 0 14px rgba(255,80,80,0.7))",
//             "drop-shadow(0 0 8px rgba(255,80,80,0.5))",
//           ],
//           transition: {
//             duration: 0.9,
//             ease: [0.16, 1, 0.3, 1],
//             times: [0, 0.45, 0.8, 1],
//           },
//         },
//       }}
//     />
//   );
// }






// DemoIcon.jsx
// import { motion } from "framer-motion";

// export default function DemoIcon() {
//   return (
//     <motion.svg
//       viewBox="0 0 600 400"
//       // style={{width:"100%", height:"100%"}}
//       style={{ width: "120px", height: "200px" }}
//     >
//       <motion.path
//         d="
//         M100 330
//         L100 200
//         Q100 100 150 80
//         L400 -100
//         M0 30
//         "


//         //    d="
//         // M100 240
//         // L100 200
//         // Q100 100 150 80
//         // L400 -100
//         //       "

//         //         d="
//         // M100 330
//         // L100 200
//         // Q100 100 100 80
//         // L400 -100
//         // M0 30
//         // "



//         stroke="#E9113B"
//         strokeWidth="135"
//         strokeLinecap="round"
//         fill="none"
//         initial={{ pathLength: 0 }}
//         animate={{ pathLength: 1 }}
//         transition={{
//           duration: 0.65,
//           ease: "easeInOut",
//         }}
//       />
//     </motion.svg>
//   );
// }



// DemoIcon.jsx
// import { useEffect, useMemo } from "react";
// import { motion, useMotionValue, useTransform, animate } from "framer-motion";
// import { interpolate } from "flubber";

// const START_PATH = `
//   M100 330
//   L100 200
//   Q100 100 150 80
//   L400 40
// `;

// const END_PATH = `
//   M7 215
//   C7 210.375 7 202.669 7 198.875
//   C7 195.081 9.387 189.556 12.328 186.546
//   C15.269 183.535 21.016 181.018 25.154 180.928
//   C29.293 180.837 35.095 182.991 38.103 185.733
//   L43.552 190.702
// `;

// export default function DemoIcon({ play = true }) {
//   const progress = useMotionValue(0);

//   // flubber se interpolator banta hai (0 -> START, 1 -> END)
//   const interpolator = useMemo(
//     // () => interpolate(START_PATH, END_PATH, { maxSegmentLength: 2 }),
//     () => interpolate(START_PATH, END_PATH, { maxSegmentLength: 2 }),
//     []
//   );

//   const d = useTransform(progress, (p) => interpolator(p));

//   useEffect(() => {
//     if (!play) return;

//     const controls = animate(progress, 1, {
//       duration: 0.65,
//       ease: "easeInOut",
//     });

//     return () => controls.stop();
//   }, [play, progress]);

//   return (
//     <svg
//       viewBox="0 0 540 540"
//       style={{ width: "100%", height: "100%" }}
//     >
//       <motion.path
//         d={d}
//         stroke="#E9113B"
//         strokeWidth={31}
//         strokeLinecap="round"
//         fill="none"
//       />
//     </svg>
//   );
// }


// DemoIcon.jsx

import { motion } from "framer-motion";

export default function DemoIcon({fill}) {
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
