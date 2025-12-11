import { useEffect, useRef, useState } from "react";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import SideBarTopMenu from "./components/SideBarTopMenu";

const SideBarMenu = ({ pageSize, setPageSize, isMobile, isDesktop }) => {
  const [isOpen, setIsOpen] = useState(true);
  const sidebarRef = useRef(null);

  // 🔹 Handle resize & pageSize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setPageSize(width);

      // Auto close on smaller screens if needed
      if (width <= 1280) {
        setIsOpen(false);
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setPageSize]);

  // 🔹 Close sidebar when clicking outside (only on mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        (isMobile || isDesktop) &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isOpen,isDesktop]);

  return (
    <>
      {/* MOBILE TOGGLE BUTTON (only below 640px) */}
      {(isMobile && !isDesktop) && (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
            fixed transition-all duration-300 z-50
            flex h-8 w-8 items-center justify-center
            rounded-full bg-gray-900 border border-gray-700 shadow-lg
            ${isOpen ? "left-[230px] top-4" : "left-2 top-4"}
          `}
        >
          {isOpen ? (
            <MdKeyboardDoubleArrowLeft className="text-white text-lg" />
          ) : (
            <MdKeyboardDoubleArrowRight className="text-white text-lg" />
          )}
        </button>
      )}

      {/* SIDEBAR WRAPPER */}
      <div
        ref={sidebarRef}
        className={`bg-[#00151F] h-full border-r border-[#1A2C35] transition-all duration-300
          ${isMobile ? `fixed inset-y-0 left-0 w-[250px] transform z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"}` :
            isDesktop ? `fixed inset-y-0 left-3 w-[250px] transform z-40 ${isOpen ? "max-w-[250px]" : "max-w-13"}` :
              `relative z-10 w-full ${isOpen ? "max-w-[250px]" : "max-w-13"}`
          }
        `}
      >
        {/* DESKTOP TOGGLE BUTTON (hidden on mobile) */}
        {!isMobile && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="
              cursor-pointer
              absolute -right-4 top-8
              flex h-8 w-8 items-center justify-center
              rounded-full bg-gray-900 border border-gray-700 shadow-lg
            "
          >
            {isOpen ? (
              <MdKeyboardDoubleArrowLeft className="text-white text-lg" />
            ) : (
              <MdKeyboardDoubleArrowRight className="text-white text-lg" />
            )}
          </button>
        )}



        {/* Sidebar content */}
        <div className={`w-full h-full overflow-y-auto hideScrollBar ${!isMobile && !isOpen ? "pr-3" : isDesktop ? "px-3" : ""}`}>
          <SideBarTopMenu isOpen={isOpen} />
        </div>
      </div>
    </>
  );
};

export default SideBarMenu;



