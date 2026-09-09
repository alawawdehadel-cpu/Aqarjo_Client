import { Link } from "react-router-dom";

// A reusable "nothing to show" message. Used for empty search results and
// an empty favorites list, with the title/message/button text passed in as props.
interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionTo?: string;
}

function EmptyState({ title, message, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h3 className="h4 mb-2">{title}</h3>
      <p className="text-muted-soft mb-3">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
