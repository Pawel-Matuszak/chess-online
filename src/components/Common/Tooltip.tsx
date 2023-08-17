import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";

interface Props {
  children: React.ReactNode;
  open: boolean;
  enterStyles?: string;
  leaveStyles?: string;
  styles?: string;
}

const Tooltip = ({
  children,
  open,
  enterStyles,
  leaveStyles,
  styles,
}: Props) => {
  return (
    <Transition
      as={Fragment}
      show={children && open ? true : false}
      enter={"transition-opacity duration-100 delay-1000 " + enterStyles}
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave={"transition-opacity duration-150 " + leaveStyles}
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div
        className={
          "absolute -top-3/4 left-0 inline-block rounded-lg bg-background-dialog px-3 py-2 text-sm font-bold  text-text-primary  shadow-sm " +
          styles
        }
      >
        {children}
        <div className="tooltip-arrow"></div>
      </div>
    </Transition>
  );
};

export default Tooltip;
