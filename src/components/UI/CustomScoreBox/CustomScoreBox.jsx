import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import bitCoin from "../../../assets/images/bitCoin.png";

const PortalTooltip = ({ coords, content, visible }) => {
  if (!visible || !coords) return null;

  // tooltip width (matches your class w-[260px])
  const tooltipWidth = 300;
  // vertical offset above chip (tweak as needed)
  const offsetY = 12;
  // compute centered left position
  const left = Math.round(coords.left + coords.width / 2 - tooltipWidth / 2);
  // place above chip
  const top = Math.round(coords.top - offsetY - 105); // 140 ~ tooltip height; tweak if needed

  const tooltip = (
    <div
      style={{
        position: "fixed",
        left: left,
        top: top,
        width: tooltipWidth,
        zIndex: 9999,
        pointerEvents: "none", // keep pointer events off so hover stays on chip
      }}
    >
      <div
        className="
          bg-[#0C2431] text-white p-3 rounded-lg 
          shadow-[0px_4px_4px_0px_#00000040]
          w-full opacity-100 transition-all duration-200 transform translate-y-0
        "
      >
        <div className="flex justify-between text-sm font-bold text-gray-300">
          <span>Profit on Win</span>
          <span>${content?.profit ?? "0.00"}</span>
        </div>

        <div className="flex justify-between mt-3">
          <div className="flex items-center bg-[#152F3C] rounded-md px-3 py-2 w-[48%]">
            <span className="text-white font-mono text-sm flex-1 mr-2">
              {content?.profitValue ?? "0.00000000"}
            </span>
            <img src={bitCoin} className="w-4 h-4" alt="btc" />
          </div>

          <div className="flex items-center bg-[#152F3C] rounded-md px-3 py-2 w-[48%]">
            <span className="text-white font-mono text-sm flex-1">
              {content?.chance ?? "59.65"}
            </span>
            <span className="text-gray-400 text-lg">%</span>
          </div>
        </div>
      </div>

      {/* Arrow (centered) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          bottom: -8,
          width: 12,
          height: 12,
          background: "#0C2431",
        }}
      />
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(tooltip, document.body)
    : null;
};

const CustomScoreBox = ({ score, chipsContainerRef, chipRefs }) => {
  const { initiateGame } = useSelector((state) => state.common);
  const { currentIndex, losingIndex } = useSelector((state) => state.balloons);

  // chip colors
  const getChipClasses = (index) => {
    const base =
      "rounded-xl w-[111px] shrink-0 p-3 text-xs font-bold inline-flex justify-center items-center font-InstrumentBold";

    if (initiateGame === "idle" || currentIndex === null) {
      return `${base} bg-grayNormal text-sm text-white`;
    }
    if (initiateGame === "playing") {
      if (index < currentIndex) return `${base} bg-grayNormal text-white opacity-35`;
      if (index === currentIndex) return `${base} bg-yellow-dark text-primary-black`;
      return `${base} bg-scorebox-gray text-white`;
    }
    if (initiateGame === "won") {
      if (index <= currentIndex) return `${base} bg-green-400 text-primary-black`;
      return `${base} bg-scorebox-gray text-white`;
    }
    if (initiateGame === "lost") {
      if (index === losingIndex) return `${base} bg-red-600 text-white`;
      if (index < losingIndex) return `${base} bg-scorebox-gray text-white`;
      return `${base} bg-scorebox-gray text-white`;
    }
    return `${base} bg-scorebox-gray text-white`;
  };

  // state for hovered chip: { index, rect, content }
  const [hover, setHover] = useState(null);

  // handlers
  const handleMouseEnter = (ind) => {
    const el = chipRefs?.current?.[ind];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const content = score[ind] || {};
    setHover({ index: ind, rect, content });
  };

  const handleMouseLeave = () => {
    // small delay removal could be added if desired
    setHover(null);
  };

  // update rect on resize/scroll so tooltip moves correctly
  useEffect(() => {
    if (!hover) return;
    const onScrollResize = () => {
      const el = chipRefs?.current?.[hover.index];
      if (!el) return setHover((s) => (s ? { ...s, rect: el.getBoundingClientRect() } : s));
    };
    window.addEventListener("scroll", onScrollResize, true);
    window.addEventListener("resize", onScrollResize);
    return () => {
      window.removeEventListener("scroll", onScrollResize, true);
      window.removeEventListener("resize", onScrollResize);
    };
  }, [hover, chipRefs]);

  return (
    <div className="w-full mt-[19px] space-y-3">
      <div className="flex justify-end items-center w-full">
        {score.length > 0 && (
          <div
            ref={chipsContainerRef}
            className="flex items-center w-full overflow-x-auto whitespace-nowrap gap-2 pr-2 hideScroll"
          >
            {score.map((item, ind) => (
              <div
                key={ind}
                ref={(el) => (chipRefs.current[ind] = el)}
                className="relative"
                onMouseEnter={() => handleMouseEnter(ind)}
                onMouseLeave={handleMouseLeave}
              >
                {/* CHIP UI */}
                <span className={getChipClasses(ind)}>{item.title}</span>
              </div>
            ))}

            {/* Portal tooltip rendered to body */}
            <PortalTooltip
              coords={hover?.rect}
              content={hover?.content}
              visible={Boolean(hover)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomScoreBox;
