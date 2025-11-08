import { memo, useEffect } from "react";
import ReactDOM from "react-dom";
import { RxCross2 } from "react-icons/rx";
import useClickAwayToClose from "../../Utils/hooks/useClickAwayToClose";

const Dialog = memo(
  ({ children, onclose, showIcon = false, clickAwayToClose, width }) => {
    useEffect(() => {
      document.body.style.overflowY = "hidden";
      return () => {
        document.body.style.overflowY = "scroll";
      };
    }, []);

    const ref = useClickAwayToClose(() =>
      clickAwayToClose ? onclose() : null
    );

    return ReactDOM.createPortal(
      <div className="fixed flex justify-center items-center inset-0 z-40 px-4 bg-[#211A4599] ">
        <div
          ref={ref}
          style={{ width: width ? width : null }}
          className="relative bg-c2 w-full md:w-fit rounded-[6px] md:mx-auto  "
        >
          <div className="">
            {showIcon && (
              <RxCross2
                onClick={onclose}
                size={30}
                className="absolute top-2 right-4 cursor-pointer h-6 w-6"
              />
            )}
          </div>

          {children}
        </div>
      </div>,
      document.querySelector(".myportalModelDiv")
    );
  }
);

Dialog.displayName = "Dialog";

export default Dialog;
