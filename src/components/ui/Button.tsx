import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button {...props} className="px-4 py-2 rounded bg-black text-white">
      {children}
    </button>
  );
}
