import type { ButtonHTMLAttributes, ReactNode } from "react";
import cn from "classnames";

type Variant = "primary" | "info" | "danger";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

const variantToClass: Record<Variant, string> = {
  primary: "bg-darkYellow text-white",
  info: "bg-lightBlue text-white",
  danger: "bg-red text-white",
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...others
}: IButtonProps) => {
  const classVariant = variantToClass[variant];

  return (
    <button
      className={cn(`${classVariant} w-fit py-[6px] px-4 rounded-md`, className)}
      type="button"
      {...others}
    >
      {children}
    </button>
  );
};

export { Button };
