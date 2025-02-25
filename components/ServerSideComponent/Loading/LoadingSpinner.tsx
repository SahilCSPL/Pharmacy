// components/LoadingSpinner.jsx
export default function LoadingSpinner() {
    return (
      <div className="flex justify-center items-center h-[100vh] bg-gray-100">
        <svg
          className="animate-spin h-10 w-10 text-[--mainColor]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
      </div>
    );
  }
  