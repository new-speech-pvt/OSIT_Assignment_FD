/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from "react";
import Calender from "./Calendar";

const DatePicker = ({
  value,
  placeholder,
  name,
  callback,
  divClasses,
  inputClasses,
  id,   
  icon,
  required,
  // src = { datePickerImg },
  onFocus = ()=> null,
  readOnly,
  disableFuture = false,    
  disablePast = false,
}) => {
  const [showCalender, setShowCalender] = useState(false);
  const handleSelectedDate = useCallback(
    (e, val) => {
      callback(e, val);
      setShowCalender(false);
    },
    [value]
  );
 
  const handleFocus = (e) => {
    if (readOnly) return;
    setShowCalender(true);
    onFocus(e);
  };
  return (
    <div className={`relative ${divClasses} h-[48px]`}>
      <input
        autoComplete="off"
        inputMode="none"
        onChange={() => null}
        onFocus={handleFocus}
        value={value}
        readOnly={readOnly}
        type="text"
        id={id}
        style={{ caret: "transparent" }}
        placeholder={placeholder}
        className={`w-full h-full outline-none border border-primary-c3 b21 md:b3 text-body-c5 read-only:bg-[#ECF0F9] disabled:bg-[#5D5E61BD] disabled:text-white read-only:cursor-not-allowed  px-4 rounded-[8px] ${inputClasses} placeholder:text-primary-c3 placeholder:font-normal placeholder:font-[Poppins] placeholder:text-[16px] placeholder:leading-[20.08px] `}
        // className={`caret-transparent  w-full focus:outline-none rounded-lg ${inputClasses}`}
        required={required}
      />
      {icon && (
        <img
          onClick={() => {
            if (readOnly) return;
            setShowCalender(true);
          }}
          src="/Calendericon.png" 
          alt="calendar icon"
          loading="lazy"
          className=" w-[30px] h-[30px] absolute right-0 top-0 bottom-0 my-auto mr-4  opacity-30 "
        />
      )}
      {showCalender && (
        <Calender
          callback={handleSelectedDate}
          onclose={() => setShowCalender(false)}
          name={name}
          initialDate={value}
          disableFuture={disableFuture}
          disablePast={disablePast}
        />
      )}
    </div>
  );
};
 
export default DatePicker;    


