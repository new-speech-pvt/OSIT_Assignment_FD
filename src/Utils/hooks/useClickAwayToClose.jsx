import { useEffect, useRef } from "react";
 
const useClickAwayToClose = (callback) => {
    const ref = useRef();
 
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                callback();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, [ref]);
 
    return ref;
};
 
export default useClickAwayToClose;