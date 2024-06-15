import {
  forwardRef,
  type DetailedHTMLProps,
  type SelectHTMLAttributes,
} from "react";

interface TSelectInputProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  options: { key: string; value: string }[];
}

const SelectInput = forwardRef<HTMLSelectElement, TSelectInputProps>(
  ({ options, className, ...others }, forwardedRef) => {
    return (
      <select
        ref={forwardedRef}
        onChange={others.onChange}
        className={`border-solid border-grey border-[2px] pr-[59px] py-2 rounded-md ${className}`}
        {...others}
      >
        <option value="" className="hidden">
          Select Option
        </option>
        {options.map(({ key, value }, index) => (
          <option key={key} value={index}>{value}</option>
        ))}
      </select>
    );
  }
);

SelectInput.displayName = "SelectInput";

export { SelectInput };
