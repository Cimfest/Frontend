import { CheckCircle2, AlertTriangle, Clock, CircleDot } from "lucide-react";

type Status = "Completed" | "Processing" | "Failed" | "Pending";

const statusConfig = {
  Completed: {
    text: "Completed",
    icon: <CheckCircle2 className="h-4 w-4" />,
    className: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  Processing: {
    text: "Processing",
    icon: <Clock className="h-4 w-4 animate-spin" />,
    className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  Failed: {
    text: "Failed",
    icon: <AlertTriangle className="h-4 w-4" />,
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  Pending: {
    text: "Pending",
    icon: <CircleDot className="h-4 w-4" />,
    className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
};

export const StatusBadge = ({ status }: { status: Status }) => {
  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full border ${config.className}`}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};
