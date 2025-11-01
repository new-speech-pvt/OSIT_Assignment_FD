const Card = ({ children, className = "" }) => (
    <div
        className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-4 sm:p-6 transition-all hover:shadow-lg ${className}`}
    >
        {children}
    </div>
);

export default Card;