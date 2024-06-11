import {
  forwardRef,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from "react";
import cn from "classnames";

interface ITextInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  className?: string;
}

const TextInput = forwardRef<HTMLInputElement, ITextInputProps>(
  ({ className, ...otherProps }, forwardedRef) => {
    return (
      <input
        ref={forwardedRef}
        type="text"
        className={cn(
          "border-solid border-grey border-[2px] py-1 px-3 rounded-md",
          className
        )}
        {...otherProps}
      />
    );
  }
);

TextInput.displayName = "TextInput";

export { TextInput };
