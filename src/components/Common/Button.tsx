import React from "react";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

const Button = (props: Props) => {
  return (
    <button
      {...props}
      className="rounded-sm bg-yellow-300 p-2 font-semibold text-slate-900 "
    >
      {props.children}
    </button>
  );
};

export default Button;
