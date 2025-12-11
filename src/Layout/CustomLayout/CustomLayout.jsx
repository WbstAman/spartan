import { useState } from "react";
import Header from "../../components/Header/Header";
import SideBarMenu from "../../components/SideBarMenu/SideBarMenu";

const CustomLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageSize, setPageSize] = useState("");
  const isMobile = pageSize <= 640;
  const isDesktop = pageSize <= 1280 && pageSize >= 640;

  console.log('isDesktop', isDesktop)

  return (
    <div className="h-screen flex justify-between w-full mx-auto overflow-hidden gap-[15px] xl:gap-[25px] sm:px-5">
      <SideBarMenu pageSize={pageSize} setPageSize={setPageSize} isMobile={isMobile} isDesktop={isDesktop} />

      {/* MAIN WRAPPER */}
      <div
        className={`overflow-auto gap-3 transition-all duration-300 w-full hideScrollBar
          ${!isOpen && !isMobile
            ? "max-w-[calc(100%-70px)] ml-auto"  // subtract max-w-13 when sidebar open
            : "max-w-full"
          }
        `}
      >
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
};

export default CustomLayout; 
 