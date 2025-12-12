import React from "react";
import ReactDOM from "react-dom";

const CustomModal = ({
  isOpen,
  onClose,
  children,
  title = "",
  width = "max-w-md",
  showClose = true,
  closeOnOutside = true,
  isTopIcon = false,
  topIcon
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-[#04121BCC]"
        onClick={() => closeOnOutside && onClose()}
      />

      {/* MODAL BOX */}
      <div
        className={`relative bg-[#132633] rounded-3xl shadow-lg w-full ${width} mx-4 p-8 animate-scaleIn`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        {(title || showClose) && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              {
                isTopIcon && topIcon
              }
              <h2 className="text-[18px] font-bold font-InstrumentBold">{title}</h2>

            </div>
            {showClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* BODY */}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default CustomModal;
