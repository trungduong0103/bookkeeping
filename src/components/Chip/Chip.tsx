import Image from "next/image";

const Chip = ({
  title,
  onRemove,
  className,
}: {
  title: string;
  className?: string;
  onRemove?: (title: string) => void;
}) => {
  return (
    <div
      className={`prose text-sm flex gap-2 items-center border-solid border-grey border-[2px] py-1 px-5 rounded-2xl ${className}`}
    >
      <span>{title}</span>
      {onRemove && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          onClick={() => onRemove(title)}
          className="w-[14px] h-[14px] cursor-pointer flex items-center justify-center"
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <Image alt="Close Icon" width={14} height={14} src="/close.svg" />
        </div>
      )}
    </div>
  );
};

export { Chip };
