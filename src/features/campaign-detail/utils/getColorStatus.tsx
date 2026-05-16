export const getColorStatus = (status: string) => {
  switch (status) {
    case 'Active':
      return <div className="rounded-md bg-[#FF9500] px-3 py-2 text-xs font-semibold text-white">Active</div>;
    case 'Paused':
      return <div className="rounded-md bg-[#A2845E] px-3 py-2 text-xs font-semibold text-white">Paused</div>;
    case 'Completed':
      return <div className="rounded-md bg-[#6F767E] px-3 py-2 text-xs font-semibold text-white">Completed</div>;
    default:
      return <div className="rounded-md bg-[#A2845E] px-3 py-2 text-xs font-semibold text-white">Paused</div>;
  }
};
