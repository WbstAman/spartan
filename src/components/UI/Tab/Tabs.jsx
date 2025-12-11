export function Tabs({ tabs = [], onClick }) {
  return (
    <div className="flex justify-center items-center w-full max-w-full sm:max-w-[276px] bg-primary-black rounded-[48px] p-1.5">
      {tabs?.map((item, index) => {
        const active = item?.isActive
        return (
          <button
            key={index}
            type="button"
            onClick={() => onClick(index, item)}   // <-- use onClick from parent
            aria-pressed={active}
            className={`max-w-[129px] p-2 rounded-3xl w-full text-sm font-semibold transition cursor-pointer h-10  ${active ? "bg-scorebox-gray text-white" : "text-gray-300"
              }`}
          >
            <span className="font-InstrumentBold text-[16px]">{item.title}</span>
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
