import React from "react";
import Tooltip from "./Tooltip";

interface Props {
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
  tooltip?: string;
}

const IconButton = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        {...props}
        data-popover-target="popover-description"
        className={
          "flex items-center justify-center rounded-lg p-2 font-semibold hover:bg-hover hover:bg-opacity-80 " +
          props.className
        }
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {props.children}
      </button>
      <Tooltip open={open}>{props.tooltip}</Tooltip>
    </div>
  );
};

export default IconButton;
