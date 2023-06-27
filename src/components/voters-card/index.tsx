type Props = {
  name: string;
  estimate: string | number;
  revealEstimates: boolean;
};

const VotersCard: React.FC<Props> = (props) => {
  return (
    <div className="truncate flex flex-col gap-1 justify-center items-center text-xs ">
      <div
        className={`${
          props.estimate ? "card" : "bg-zinc-300"
        } h-[100px] w-[65px] flex flex-col justify-center items-center text-xs rounded-md p-3`}
      >
        {props.revealEstimates && props.estimate && (
          <div className="text-zinc-800 text-3xl font-semibold p-1 rounded bg-gray-50">
            {props.estimate}
          </div>
        )}
      </div>
      <p className="truncate w-[70px] text-center">{props.name}</p>
    </div>
  );
};

export default VotersCard;
