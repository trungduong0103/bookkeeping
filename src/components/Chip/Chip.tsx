const Chip = ({
  title,
  onRemove,
}: {
  title: string;
  onRemove?: (title: string) => void;
}) => {
  return (
    <div className="prose text-sm flex gap-2 items-center border-solid border-grey border-[2px] py-1 px-5 rounded-2xl">
      <span>{title}</span>
      {onRemove && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <span
          onClick={() => onRemove(title)}
          className="text-[10px] cursor-pointer"
        >
          X
        </span>
      )}
    </div>
  );
};

export { Chip };
