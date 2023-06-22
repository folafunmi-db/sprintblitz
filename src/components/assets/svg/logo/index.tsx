export const Logo = ({
  width = "40",
  height = "40",
  showBg = true,
}: {
  width?: string;
  height?: string;
  showBg?: boolean;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 100 100"
    >
      {showBg && <rect width="100" height="100" rx="20" fill="#525fe1"></rect>}
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize="57"
      >
        🚀
      </text>
    </svg>
  );
};
