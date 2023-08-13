import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
}

const IconButton = (props: Props) => {
  return (
    <button
      {...props}
      className={"rounded-sm p-2 font-semibold " + props.className}
    >
      {props.children}
    </button>
  );
};

export default IconButton;
