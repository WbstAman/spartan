import { AiOutlineExpand } from "react-icons/ai";
import CustomSwitchButton from "../../UI/Buttons/CustomSwitchButton";
import CommonHeading from "../../UI/CommonHeading/CommonHeading";
import { useState } from "react";

const GameHeader = ({ gameName, balance }) => {

    const [mode, setMode] = useState("demo");

  return (
    <div className="flex justify-between items-center p-3 sm:pb-0 sm:pt-3 sm:pr-2">
      <div className="flex gap-4">
        <div className="flex justify-start items-center ">
          <AiOutlineExpand className="text-white text-md3 mr-4 " />
          <CommonHeading text={gameName} fontSize="small" />
        </div>

        <div className="flex justify-between items-center gap-1.5 mr-4 text-white">
          <span className="text-sm font-InstrumentSansSemiBold">Available Balance :</span>
          <span className="text-sm font-InstrumentSansSemiBold">{(Number(balance) || 0).toFixed(2)}</span>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <CustomSwitchButton mode={mode} setMode={setMode} />
      </div>
    </div>
  );
};

export default GameHeader;
