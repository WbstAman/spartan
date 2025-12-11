import { useEffect, useRef, useState } from "react";
export default function CustomSelectInputField({
    label = "",
    rightLabel = "",
    options = [],
    value = null,
    onChange = () => { },
    placeholder = "Select option",
    className = "",
    disabled = false,
  maxHeight = 200, // px me dropdown ki max height
}) {
    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef(null);
    const listRef = useRef(null);
    const buttonRef = useRef(null);

    const menuMaxHeight =
  typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;


    // Normalize options — try multiple common keys and fallback to index/string
    const normalizedOptions = (options || []).map((opt, idx) => {
        if (opt == null) return { title: String(opt), value: opt };

        if (typeof opt === "string" || typeof opt === "number") {
            return { title: String(opt), value: opt };
        }

        // opt is object — try many possible keys
        const title =
            opt.title ??
            opt.label ??
            opt.name ??
            (typeof opt.value !== "undefined" ? String(opt.value) : undefined) ??
            String(opt);

        const value =
            opt.value ?? opt.valie ?? opt.id ?? opt.key ?? opt.valueString ?? opt.val ?? opt;

        return { title: title ?? String(opt), value };
    });

    // find selected index
    const selectedIndex = normalizedOptions.findIndex((o) => {
        // try strict equality first, then fallback to string compare
        if (o.value === value) return true;
        if (typeof o.value !== "undefined" && typeof value !== "undefined") {
            return String(o.value) === String(value);
        }
        return false;
    });

    // label shown on button
    const displayLabel =
        selectedIndex >= 0 ? normalizedOptions[selectedIndex].title : placeholder;

    // close on outside click
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const scrollIntoViewIfNeeded = (index) => {
        if (!listRef.current || index < 0) return;
        const item = listRef.current.querySelector(`[data-index="${index}"]`);
        if (item) {
            listRef.current.scrollTo({
                top: item.offsetTop,
                behavior: "smooth",
            });
        }
    };

    const handleSelect = (opt) => {
        // opt is normalized option { title, value }
        // ensure we don't send undefined — fallback to title or index
        const out =
            typeof opt.value !== "undefined" && opt.value !== null
                ? opt.value
                : opt.title ?? opt;
        onChange(out);
        setOpen(false);
        setHighlightedIndex(-1);
        setTimeout(() => buttonRef.current?.focus(), 0);
    };

    const toggleOpen = () => {
        setOpen((prev) => {
            const next = !prev;
            if (next) {
                const idx = selectedIndex >= 0 ? selectedIndex : 0;
                setHighlightedIndex(idx);
                setTimeout(() => scrollIntoViewIfNeeded(idx), 10);
            } else {
                setHighlightedIndex(-1);
            }
            return next;
        });
    };

    // keyboard navigation
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightedIndex((hi) => {
                    const next = Math.min(hi + 1, normalizedOptions.length - 1);
                    scrollIntoViewIfNeeded(next);
                    return next;
                });
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((hi) => {
                    const prev = Math.max(hi - 1, 0);
                    scrollIntoViewIfNeeded(prev);
                    return prev;
                });
            } else if (e.key === "Enter") {
                e.preventDefault();
                const idx = highlightedIndex >= 0 ? highlightedIndex : selectedIndex;
                if (idx >= 0 && idx < normalizedOptions.length) {
                    handleSelect(normalizedOptions[idx]);
                }
            } else if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
                setHighlightedIndex(-1);
                buttonRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, highlightedIndex, normalizedOptions, selectedIndex]);

    return (
        <div ref={wrapperRef} className={`relative w-full ${className}`}>
              {(label || rightLabel) && (
        <div className="flex justify-between items-center">
          <label className="text-gray text-[14px] font-bold font-InstrumentBold leading-[17px]">
            {label}
          </label>
          <label className="text-gray text-[14px] font-bold font-InstrumentBold leading-[17px]">
            {rightLabel}
          </label>
        </div>
      )}

            <div className="mt-2 flex items-center rounded-lg overflow-hidden bg-primary-gray px-3 py-2 shadow-[0_6px_16px_rgba(0,0,0,0.6)] border-2 border-scorebox-gray">
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={toggleOpen}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    disabled={disabled}
                    className="w-full flex items-center justify-between text-left"
                >
                    <span className={`truncate ${selectedIndex >= 0 ? "text-white font-semibold" : "text-gray-400"}`}>
                        {displayLabel}
                    </span>

                    <svg
                        className={`h-4 w-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

          {open && (
  <ul
    ref={listRef}
    role="listbox"
    className="absolute left-0 right-0 bg-primary-black border-2 border-scorebox-gray rounded-lg mt-1 shadow-lg z-50 overflow-y-auto hideScrollBar"
    style={{ maxHeight: menuMaxHeight }} // 👈 yaha apply karo
  >
    {normalizedOptions.length === 0 ? (
      <li className="px-4 py-2 text-white">No options</li>
    ) : (
      normalizedOptions.map((item, i) => {
        const isSelected = i === selectedIndex;
        const isHighlighted = i === highlightedIndex;
        return (
          <li
            key={i}
            data-index={i}
            onMouseEnter={() => setHighlightedIndex(i)}
            onMouseLeave={() => setHighlightedIndex(-1)}
            onClick={() => handleSelect(item)}
            className={`px-4 py-1.5 cursor-pointer truncate flex items-center justify-between font-InstrumentBold ${
              isHighlighted ? "bg-dullBlue text-black" : "text-white"
            } ${isSelected ? "font-medium" : ""}`}
          >
            <span>{item.title}</span>
          </li>
        );
      })
    )}
  </ul>
)}

        </div>
    );
}
