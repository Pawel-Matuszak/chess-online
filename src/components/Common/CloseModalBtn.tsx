interface Props {
  onClick: () => void;
  children?: React.ReactNode;
}

const CloseModalBtn: React.FC<Props> = ({ onClick, children }) => {
  return (
    <button
      type="button"
      className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-hover hover:text-text-hover"
      onClick={onClick}
    >
      <svg
        className="h-3 w-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
      <span className="sr-only">{children}</span>
    </button>
  );
};

export default CloseModalBtn;
