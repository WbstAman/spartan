import React from "react";

const CustomButton = ({
  title = "Click Me",
  onClick,
  icon = null,       // 👈 optional icon
  variant = "default",
  type = "button",
  className = "",
  disabled = false,
  size = "auto",
}) => {
  // tailwind style mappings
  const variantStyles = {
    default: "bg-yellow-dark text-black hover:bg-yellow-dull",
    primary: "bg-gray-light text-white",
    secondary: "bg-green-600 hover:bg-green-700 text-white",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-200",
  };

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}   // prevent click
      disabled={disabled}
      style={{ maxWidth: size !== "auto" ? `${size}px` : "auto" }}
      className={`
        h-[43px]
    flex items-center justify-center gap-2 font-InstrumentSansSemiBold
    rounded-lg p-2 font-bold w-full transition text-[16px]
    ${variantStyles[variant]}   // always show variant color
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {title}
    </button>

  );
};

export default CustomButton;
