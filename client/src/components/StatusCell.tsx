import { type ICellRendererParams } from 'ag-grid-community';

export const StatusCell = (params: ICellRendererParams) => {
  const status = params.value;
  let color = 'bg-green-500';

  if (status === 'WARN') color = 'bg-yellow-500';
  if (status === 'CRITICAL') color = 'bg-red-500';

  return (
    <div className={`flex items-center gap-2 h-full`}>
      <span className={`w-3 h-3 rounded-full ${color}`}></span>
      <span>{status}</span>
    </div>
  );
};
