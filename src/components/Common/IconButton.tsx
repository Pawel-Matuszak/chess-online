import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";

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
      <Transition
        as={Fragment}
        // show={true}
        show={props.tooltip && open ? true : false}
        enter="transition-opacity duration-100 delay-1000"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="absolute -top-3/4 left-0 inline-block rounded-lg bg-background-dialog px-3 py-2 text-sm font-bold  text-text-primary  shadow-sm ">
          {props.tooltip}
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      </Transition>
    </div>
  );
};

export default IconButton;
