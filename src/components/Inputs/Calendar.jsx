    /* eslint-disable react-hooks/exhaustive-deps */
    import { useEffect, useRef, useState } from "react";
    import ReactDOM from "react-dom";
    import moment from "moment";
    import useClickAwayToClose from "../../Utils/hooks/useClickAwayToClose";
    
    const Calender = ({
    callback,
    onclose,
    name,
    initialDate = moment().format("DD-MM-YYYY"),
    disableFuture = false,
    disablePast = false,              
    }) => {
    const clickAwayToClose = () => (onclose ? onclose() : null);
    const ref = useClickAwayToClose(clickAwayToClose);
    
    const [date, setDate] = useState(
        initialDate == ""
        ? moment()
        : initialDate == "Today"
        ? moment()
        : moment(initialDate, "DD-MM-YYYY")
    );
    const currentMonth = date.month();
    const currentYear = date.year();
    const currentDate = date.date();
    const week = ["S", "M", "T", "W", "T", "F", "S"];
    const [Months, setMonths] = useState([]);
    const [Years, setYears] = useState([]);
    const [Dates, setDates] = useState([]);
    const [showMonths, setShowMonths] = useState(false);
    const [showYears, setShowYears] = useState(false);
    const yearsRef = useRef(null);
    
    const isCurrentDate = (item) => {
        const checkIsCurrentDate =
        date.clone().date(item).format("DD-MM-YYYY") ===
        moment().format("DD-MM-YYYY");
        return checkIsCurrentDate;
    };
    
    const selectedDate = (item) => {
        const checkIsSelectedDate = currentDate == item;
    
        return checkIsSelectedDate;
    };
    
    const isSunday = (item) => {
        return date.clone().date(item).day() === 0;
    };
    const isSatureday = (item) => {
        return date.clone().date(item).day() == 6;
    };
    
    const genrateYears = () => {
        const years = [];
        for (let index = 1900; index < date.year() + 100; index++) {
        years.push(index);
        }
    
        return setYears(years);
    };
    const genrateMonths = () => {
        const months = [];
        for (let index = 0; index < 12; index++) {
        months.push(index);
        }
        return setMonths(months);
    };
    
    const genrateDates = () => {
        const dates = [];
        for (let index = 1; index <= date.daysInMonth(); index++) {
        dates.push(index);
        }
    
        return setDates(dates);
    };
    
    const isDisabledDate = (item) => {
        const current = moment().startOf("day");
        const thisDate = date.clone().date(item).startOf("day");
    
        if (disableFuture && thisDate.isAfter(current)) return true;
        if (disablePast && thisDate.isBefore(current)) return true;
    
        return false;
    };
    
    useEffect(() => {
        // Scroll to current year element
        yearsRef?.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
        });
    }, [showYears]);
    
    useEffect(() => {
        genrateYears();
        genrateMonths();
        genrateDates();
    }, [date]);
    
    return ReactDOM.createPortal(
        <div className="fixed flex justify-center items-center inset-0 z-50 bg-[#211A4599] px-4">
        <div
            ref={ref}
            className="relative bg-white w-full md:w-fit md:min-w-[350px] h-[400px] rounded-[6px] md:mx-auto p-4 md:p-[25px] "
        >
            <div className="flex relative justify-between items-center text-lg font-bold text-purple-800 mb-4">
            <button
                onClick={() => {
                setShowMonths((prevVal) => !prevVal);
                setShowYears(false);  
                }}
            >
                {date.format("MMMM")}
            </button>
            <button
                onClick={() => {
                setShowYears((prevVal) => !prevVal);
                setShowMonths(false);
                }}
            >
                {date.format("YYYY")}
            </button>
            </div>
    
            {showYears ? (
            <div className="grid grid-cols-3 h-[300px] overflow-auto justify-center text-center">
                {Years.map((year) => (
                <div
                    onClick={() => {
                    setDate(
                        moment().year(year).month(currentMonth).date(currentDate)
                    );
                    setShowYears(false);
                    }}
                    key={year}
                    ref={currentYear == year ? yearsRef : null}
                    className={`cursor-pointer p-3 font-f2 font-w2 text-[15px] rounded-full`}
                >
                    <span
                    className={`text-center block  py-2 rounded-full ${
                        currentYear == year
                        ? "bg-purple-900 b1 text-white"
                        : "text-purple-900"
                    }`}
                    >
                    {year}
                    </span>
                </div>
                ))}
            </div>
            ) : showMonths ? (
            <div className="grid grid-cols-3 h-[300px] overflow-auto justify-center text-center">
                {Months.map((month, i) => (
                <div
                    onClick={() => {
                    setDate(
                        moment().year(currentYear).month(month).date(currentDate)
                    );
                    setShowMonths(false);
                    }}
                    key={i}
                    className={`cursor-pointer p-2 font-f2 font-w2 text-[13px] rounded-full `}
                >
                    <span
                    className={`text-center block rounded-full py-2 ${
                        currentMonth == month
                        ? "b1 bg-purple-900 text-w"
                        : "text-purple-900 b3"
                    }`}
                    >
                    {moment().month(month).format("MMM")}
                    </span>
                </div>
                ))}
            </div>
            ) : (
            <div className="relative grid grid-cols-7 w-full justify-center items-center text-center max-h-[450px] overflow-hidden">
                {week.map((day, i) => (
                <div
                    key={i}
                    className={` w-full text-center b1 ${
                    day === "S" ? "text-[#FF271B]" : "text-primary-c1 "
                    } aspect-square flex justify-center items-center`}
                >
                    {day}
                </div>
                ))}
                {[...Array(date.clone().startOf("month").day()).keys()].map(
                (_, index) => (
                    <div key={index}></div>
                )
                )}
                {Dates.map((item) => {
                const selected = selectedDate(item);
                const disabled = isDisabledDate(item);
    
                return (
                    <div
                    onClick={() => {
                        if (!disabled) {
                        setDate(
                            moment()
                            .year(currentYear)
                            .month(currentMonth)
                            .date(item)
                        );
                        }
                    }}
                    key={item}
                    className={`p-3 w-full rounded-[50%] ${
                        disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : selected && isCurrentDate(item)
                        ? "bg-purple-900 text-white b1 cursor-pointer"
                        : selected
                        ? "bg-purple-900 text-white b1 cursor-pointer"
                        : isCurrentDate(item)
                        ? "border border-purple-900 text-purple-900 b1 cursor-pointer"
                        : isSunday(item) || isSatureday(item)
                        ? "text-error cursor-pointer"
                        : "text-primary-c1 cursor-pointer"
                    }`}
                    >
                    <span className="text-center block">{item}</span>
                    </div>
                );
                })}
            </div>
            )}
    
            <div className="absolute bottom-0 right-0 flex gap-6 p-4 font-f3 text-md text-c3 font-[500]">
            <button onClick={() => onclose()} className="text-[#8A8989]">
                CANCEL
            </button>
            <button
                name={name}
                onClick={ ()=> callback({ target: { name: name, value: date.format("DD-MM-YYYY") } }, date.format("DD-MM-YYYY"))}
                className="b1 text-primary-c1"
            >
                OK
            </button>
            </div>
        </div>
        </div>,
        document.querySelector(".myportalModelDiv")
    );
    };
    
    export default Calender;
    
    