import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Card } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <Card>
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you are looking for does not exist or was moved."
      >
        <Link
          to="/"
          className="inline-flex h-10 items-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
        >
          Back to dashboard
        </Link>
      </EmptyState>
    </Card>
  );
}
