const Button = ({ children, onClick, variant = "primary" }) => {
    const base =
        "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none";
    const styles =
        variant === "primary"
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-gray-800";
    return (
        <button onClick={onClick} className={`${base} ${styles}`}>
            {children}
        </button>
    );
};

export default Button;