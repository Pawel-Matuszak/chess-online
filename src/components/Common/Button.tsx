import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
}

const Button = (props: Props) => {
  return (
    <button
      {...props}
      className={
        "rounded-sm bg-main-primary p-2 font-semibold text-background-secondary transition-all hover:bg-opacity-80 " +
        props.className
      }
    >
      {props.children}
    </button>
  );
};

export default Button;
