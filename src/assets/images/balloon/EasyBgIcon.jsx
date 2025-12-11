// const EasyBgIcon = ({ difficulty = "easy", dotsColor = "#071d2a" }) => {
//   // colour for each difficulty (if that difficulty is active, that dot gets the colour)
//   const colours = {
//     easy: "#0679FD",
//     medium: "#922BE1",
//     hard: "#FF6600",
//     expert: "#FF2828",
//   };

//   // helper to choose per-dot fill (only active difficulty shows its colour; others use dotsColor)
//   const dotFill = (label) => (difficulty === label ? colours[label] : dotsColor);

//   return (
//     <div aria-hidden>
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="100%"
//         height="100%"
//         viewBox="0 0 752 148"
//         role="img"
//         preserveAspectRatio="xMidYMid meet"
//       >
//         <g clipPath="url(#clip0_12_30)">
//           <path
//             d="M0 104C0 81.9086 17.9086 64 40 64H230C252.091 64 270 81.9086 270 104V148H0V104Z"
//             fill="#18303B"
//           />
//           <path d="M446.158 106H217.195V148H446.158V106Z" fill="#18303B" />
//           <path
//             d="M345 84C345 72.9543 353.954 64 365 64H426C437.046 64 446 72.9543 446 84V143H345V84Z"
//             fill="#18303B"
//           />
//           <path
//             d="M433.624 127H737C745.284 127 752 133.716 752 142V148H433.624V127Z"
//             fill="#18303B"
//           />

//           {/* Replace multiple path-dot shapes with simple circles and dynamic fill */}
//           <circle cx="99" cy="109" r="6" fill={dotFill("easy")} />
//           <circle cx="123" cy="109" r="6" fill={dotFill("medium")} />
//           <circle cx="147" cy="109" r="6" fill={dotFill("hard")} />
//           <circle cx="171" cy="109" r="6" fill={dotFill("expert")} />
//         </g>

//         <path d="M385 53C385 49.134 388.134 46 392 46H399C402.866 46 406 49.134 406 53V64H385V53Z" fill="#18303B" />
//         <path d="M411 16C411 22.6274 405.627 28 399 28H392C385.373 28 380 22.6274 380 16V0H411V16Z" fill="#18303B" />
//         <rect x="388" y="24" width="15" height="26" fill="#18303B" />

//         <defs>
//           <clipPath id="clip0_12_30">
//             <rect width="752" height="84" transform="translate(0 64)" />
//           </clipPath>
//         </defs>
//       </svg>
//     </div>
//   );
// };

// export default EasyBgIcon;


import React from "react";

const EasyBgIcon = ({ difficulty = "easy", dotsColor = "#071d2a" }) => {
  const colours = {
    easy: "#0679FD",
    medium: "#922BE1",
    hard: "#FF6600",
    expert: "#FF2828",
  };

  const dotFill = (label) => (difficulty === label ? colours[label] : dotsColor);

  return (
    <div aria-hidden>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 752 84"
        role="img"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        <path
          d="M0 40C0 17.9086 17.9086 0 40 0H230C252.091 0 270 17.9086 270 40V84H0V40Z"
          fill="#18303B"
        />
        <rect x="217.195" y="42" width="228.963" height="42" fill="#18303B" />
        <path
          d="M345 20C345 8.9543 353.954 0 365 0H426C437.046 0 446 8.95431 446 20V79H345V20Z"
          fill="#18303B"
        />
        <path
          d="M433.624 63H737C745.284 63 752 69.7157 752 78V84H433.624V63Z"
          fill="#18303B"
        />

        {/* Dynamic difficulty dots (only active difficulty shows its colour) */}
        <circle cx="99" cy="45" r="6" fill={dotFill("easy")} />
        <circle cx="123" cy="45" r="6" fill={dotFill("medium")} />
        <circle cx="147" cy="45" r="6" fill={dotFill("hard")} />
        <circle cx="171" cy="45" r="6" fill={dotFill("expert")} />
      </svg>
    </div>
  );
};

export default EasyBgIcon;
