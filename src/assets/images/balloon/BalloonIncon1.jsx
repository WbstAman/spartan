// // import React from "react";

// // const BalloonIcon1 = ({
// //     // width = "244px",
// //     // height = "294px",
// //     width = "100%",
// //     height = "100%",
// //     fill = "#0679FD",
// //     label = "1.00x",
// //     left = "",
// //     top = ""

// // }) => {
// //     return (
// //         <div className="m-auto relative"
// //             style={{
// //                 top: `${top}px`,
// //                 left: `${left}px`,
// //                 width, height
// //             }}
// //         >            <svg
// //             xmlns="http://www.w3.org/2000/svg"
// //             id="Layer_2"
// //             version="1.1"
// //             viewBox="0 0 465.8 543.4"
// //         >
// //                 <g id="Layer_1-2">

// //                     <g id="Balloon">
// //                         {/* Main balloon */}
// //                         <path
// //                             id="Main"
// //                             fill={fill}
// //                             d="M232.9,0c128.6,0,232.9,104.3,232.9,232.9s-163.7,278.3-232.8,275.9C163.9,506.4,0,361.5,0,232.9S104.3,0,232.9,0Z"
// //                         />
// //                         {/* Highlight */}
// //                         <ellipse
// //                             id="Highlight"
// //                             fill="#fff"
// //                             cx="333.6"
// //                             cy="75.1"
// //                             rx="24.3"
// //                             ry="37.1"
// //                             transform="translate(134.2 352.8) rotate(-67)"
// //                         />
// //                     </g>
// //                 </g>
// //             </svg>
// //         </div>
// //     );
// // };

// // export default BalloonIcon1;


// import React from "react";

// const BalloonIcon1 = ({
//   width = "100%",        // used for wrapper style
//   height = "100%",       // used for wrapper style
//   fill = "#0679FD",
// //   label = "1.00x",
//   left = 0,              // pass numbers for predictable px values
//   top = 0
// }) => {
//   return (
//     <div
//       className="relative"
//       style={{
//         width,
//         height,
//         left: `${left}px`,
//         top: `${top}px`,
//         // ensure the wrapper doesn't let the svg overflow outside
//         overflow: "hidden", 
//         display: "block"
//       }}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 465.8 543.4"
//         width="100%"
//         height="100%"
//         preserveAspectRatio="xMidYMid meet"
//         style={{ display: "block" }} // removes inline whitespace/gap
//       >
//         <g id="Layer_1-2">
//           <g id="Balloon">
//             {/* Main balloon */}
//             <path
//               id="Main"
//               fill={fill}
//               d="M232.9,0c128.6,0,232.9,104.3,232.9,232.9s-163.7,278.3-232.8,275.9C163.9,506.4,0,361.5,0,232.9S104.3,0,232.9,0Z"
//             />
//             {/* Highlight */}
//             <ellipse
//               id="Highlight"
//               fill="#fff"
//               cx="333.6"
//               cy="75.1"
//               rx="24.3"
//               ry="37.1"
//               transform="translate(134.2 352.8) rotate(-67)"
//             />
//           </g>
//         </g>
//       </svg>

//       {/* Optional label inside balloon (centered) */}
//       {/* <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           pointerEvents: "none", // label shouldn't block clicks
//         }}
//       >
//         <span className="text-white font-bold select-none">{label}</span>
//       </div> */}
//     </div>
//   );
// };

// export default BalloonIcon1;

const BalloonIcon1 = ({
  width = "100%",   // can be "100%", "300px", "min(60vw,260px)" or number (px)
  height = "100%",
  fill = "#0679FD",
  label = "",
  left = 0,         // number in px (applies to wrapper style)
  top = 0,
}) => {
  // accept either numeric px or CSS string
  const toCss = (v) => (typeof v === "number" ? `${v}px` : v);

  return (
    <div
      className="relative"
      style={{
        width: toCss(width),
        height: toCss(height),
        left: typeof left === "number" ? `${left}px` : left,
        top: typeof top === "number" ? `${top}px` : top,
        overflow: "hidden",
        display: "block",
        margin: "0 auto",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 465.8 543.4"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        <g id="Layer_1-2">
          <g id="Balloon">
            <path
              id="Main"
              fill={fill}
              d="M232.9,0c128.6,0,232.9,104.3,232.9,232.9s-163.7,278.3-232.8,275.9C163.9,506.4,0,361.5,0,232.9S104.3,0,232.9,0Z"
            />
            <ellipse
              id="Highlight"
              fill="#fff"
              cx="333.6"
              cy="75.1"
              rx="24.3"
              ry="37.1"
              transform="translate(134.2 352.8) rotate(-67)"
            />
          </g>
        </g>
      </svg>

      {/* optional centered label */}
      {label ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            textAlign: "center",
            padding: "0 6px",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
              userSelect: "none",
              fontSize: "clamp(14px, 4vw, 48px)",
              lineHeight: 1,
            }}
          >
            {label}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default BalloonIcon1;
