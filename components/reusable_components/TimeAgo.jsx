// components/TimeAgo.jsx
import { formatDistanceToNowStrict } from "date-fns";

export default function TimeAgo({ timestamp }) {
    if (!timestamp) return null;

    const date = new Date(timestamp);
    const timeAgo = formatDistanceToNowStrict(date, { addSuffix: true });

    return <span className="text-xs text-gray-500">{timeAgo}</span>;
}
