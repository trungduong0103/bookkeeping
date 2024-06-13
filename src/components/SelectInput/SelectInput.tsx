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
  ({ options, ...others }, forwardedRef) => {
    return (
      <select
        ref={forwardedRef}
        onChange={(e) => console.log(e.target.value)}
        className="border-solid border-grey border-[2px] pr-[59px] py-2 rounded-md"
        {...others}
      >
        <option value="" className="hidden">
          Select Option
        </option>
        {options.map(({ key, value }) => (
          <option key={key}>{value}</option>
        ))}
      </select>
    );
  }
);

SelectInput.displayName = "SelectInput";

export { SelectInput };
