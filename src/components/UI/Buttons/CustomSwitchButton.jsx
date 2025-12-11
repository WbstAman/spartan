import { useState } from "react";

const CustomSwitchButton = ({
  mode,
  setMode,
  defaultMode = false, // false => dot LEFT
  isLabel = true,
  onChange,
  labelText = ["Demo", "Real"],
}) => {
  const controlled = mode !== undefined && typeof setMode === "function";
  const [internal, setInternal] = useState(defaultMode);

  const currentMode = controlled ? mode : internal;

  // FALSE => left, TRUE => right  (🔥 yahi tum chahte the)
  const isLeft = currentMode === false;

  const updateMode = (next) => {
    const newValue = next ?? !currentMode;
    if (controlled) setMode(newValue);
    else setInternal(newValue);
    onChange && onChange(newValue);
  };

  return (
    <div className="flex items-center space-x-2">
      {isLabel && (
        <button
          type="button"
          aria-pressed={isLeft}
          onClick={() => updateMode(false)}
          className={`text-sm font-semibold transition-colors duration-150 font-InstrumentBold text-textGray                  `}
        >
          {labelText?.[0]}
        </button>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={!isLeft}
        onClick={() => updateMode()}
        className="relative inline-flex items-center w-11 h-6 rounded-full bg-[#041520] transition-colors duration-200"
      >
        <span
          className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-200 ease-out ${isLeft
            ? "translate-x-0 bg-gray-300"
            : "translate-x-5 bg-yellow-dark"
            }`}
        ></span>
      </button>

      {isLabel && (
        <button
          type="button"
          aria-pressed={!isLeft}
          onClick={() => updateMode(true)}
          className={`text-sm font-semibold transition-colors duration-150 font-InstrumentBold
                  ${!isLeft ? "text-yellow-dark" : "text-textGray"}
                  `}
        >
          {labelText?.[1]}
        </button>
      )}
    </div>
  );
};

export default CustomSwitchButton;
