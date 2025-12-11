import React from "react";
import { FaPercentage } from "react-icons/fa";

const PercentageField = ({
    value,
    onChange,
    tab,                // "reset" | "increase"
    setTab,             // updater function
    min = 0,
    max = 100,
    className = "",
    label = "",
    rightLabel = "",
}) => {

    const handleInputChange = (e) => {
        let val = e.target.value;
        if (val === "") return onChange("");

        val = val.replace(/[^\d]/g, "");
        const num = Number(val);
        if (isNaN(num)) return;

        onChange(Math.max(min, Math.min(max, num)));
    };

    const handleResetClick = () => {
        setTab("reset");
        onChange(0); // reset value
    };

    const handleIncreaseClick = () => {
        setTab("increase");
    };

    const inputDisabled = tab === "reset";

    return (
        <>
            <div className="mb-2">
                {(label || rightLabel) && (
                    <div className="flex justify-between items-center">
                        <label className="text-gray text-[13px] font-bold font-InstrumentBold leading-[17px]">
                            {label}
                        </label>
                        <label className="text-gray text-[13px] font-bold font-InstrumentBold leading-[17px]">
                            {rightLabel}
                        </label>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center gap-1.5 mb-3.5">
                <div
                    className={
                        "w-full bg-primary-black rounded-xl p-1 gap-1.5 " +
                        className
                    }
                >
                    {/* TAB BUTTONS */}
                    <div className="flex justify-between items-center gap-2">
                        <button
                            type="button"
                            onClick={handleResetClick}
                            className={`py-2 px-1.5 text-[14px] rounded-md max-w-[60px] w-full font-InstrumentBold ${tab === "reset" ? "bg-scorebox-gray text-gray-300" : "text-gray"
                                }`}
                        >
                            Reset
                        </button>

                        <button
                            type="button"
                            onClick={handleIncreaseClick}
                            className={`py-2 px-1.5 text-[14px] rounded-md  max-w-[100px] w-full font-InstrumentBold  ${tab === "increase"
                                ? "bg-scorebox-gray text-gray-300" : " text-gray"}`}
                        >
                            Increase by :
                        </button>
                    </div>


                </div>
                {/* INPUT FIELD */}
                <div
                    className={`max-w-24 w-full border-2 border-[#466273] rounded-md h-full flex justify-between items-center  py-2 px-2 ${inputDisabled ? "bg-bg-primary-black/50" : "bg-primary-black"
                        }`}
                >
                    <input
                        type="number"
                        min={min}
                        max={max}
                        value={value === "" ? "" : value}
                        disabled={inputDisabled}
                        onChange={handleInputChange}
                        className="
                        font-InstrumentBold
                        
            w-full h-full bg-transparent 
            outline-none focus:outline-none focus:ring-0 focus:ring-transparent focus:border-transparent
            disabled:text-gray-500 disabled:cursor-not-allowed
           text-[14px]
          "
                    />
                    <FaPercentage className="text-xs opacity-70" />
                </div>
            </div>
        </>

    );
};

export default PercentageField;
