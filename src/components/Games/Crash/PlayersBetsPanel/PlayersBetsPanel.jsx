import React, { useState } from "react";
import { IoChevronUpSharp } from "react-icons/io5";
import UserIcon from "../../../../assets/images/svgImages/UserIcon";
import HiddenIcon from "../../../../assets/images/svgImages/Hidden";
import { useSelector } from "react-redux";

const PlayersBetsPanel = ({ activeTab, icon }) => {
  const [isOpen, setIsOpen] = useState(true);

  const currentRoundWinners = useSelector(
    (state) => state.crash.currentRoundWinners
  );

  const displayRows = currentRoundWinners.length > 0 ? currentRoundWinners : [];

  const totalPlayers = displayRows.length;
  const totalPot = displayRows
    .reduce((sum, w) => sum + parseFloat(w.amount), 0)
    .toFixed(2);

  return (
    <div
      className="max-w-full xl:max-w-sm rounded-lg text-sm text-slate-100 w-full overflow-hidden mt-3.5 h-full"
      style={{
        maxHeight: activeTab === 0 ? "320px" : "295px",
        marginBottom: activeTab === 0 ? "0" : "20px",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-2 py-[13px] cursor-pointer select-none bg-[#071723]"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          <UserIcon className="text-md font-medium text-slate-300" />
          <span className="font-semibold text-[13px]">
            {totalPlayers}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {icon && (
            <img
              src={icon}
              alt="currency"
              className="w-[18px] h-[18px] rounded-full"
            />
          )}
          <span className="font-semibold">{totalPot || "0.00"}</span>
          <IoChevronUpSharp
            className={`text-xs text-slate-300 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="overflow-auto bets-scroll px-4 py-2 space-y-1 bg-[#071723] h-full">
          {displayRows.length === 0 ? (
            <div className="text-center text-slate-500 py-8 text-xs">
              No winners yet this round
            </div>
          ) : (
            displayRows.map((winner, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-[13px] leading-tight animate-fadeIn"
              >
                <div className="w-[40%] flex items-center gap-1 font-InstrumentSansMedium">
                  {winner.nick === "HOUSE" ? (
                    <HiddenIcon className="text-xs text-slate-400" />
                  ) : null}
                  <span
                    className={`truncate ${
                      winner.nick === "HOUSE"
                        ? "text-slate-400"
                        : "text-green-400 font-bold"
                    }`}
                  >
                    {winner.nick}
                  </span>
                </div>

                <div className="w-[20%] text-slate-500 text-xs">
                  {winner.time}
                </div>

                <div className="w-[40%] flex items-center justify-end gap-2">
                  {icon && (
                    <img
                      src={icon}
                      alt="currency"
                      className="w-[18px] h-[18px] rounded-full"
                    />
                  )}
                  <span className={`font-bold text-[#E4FF00] animate-pulse`}>
                    +{winner.amount}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PlayersBetsPanel;
