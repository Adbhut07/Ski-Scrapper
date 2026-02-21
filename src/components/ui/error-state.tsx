import { AlertTriangle, Search, RefreshCw, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title || "Something went wrong"}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-4">
        <Search className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No flights found</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-2">
        No flights found for the selected route and date. Try adjusting your search criteria.
      </p>
      <ul className="text-sm text-muted-foreground space-y-1 mb-6">
        <li>• Try different dates</li>
        <li>• Search for nearby airports</li>
        <li>• Reduce the number of stops</li>
      </ul>
    </div>
  );
}

export function InitialState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-4">
        <Plane className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Search for flights</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Enter your travel details above to find the best flight deals.
      </p>
    </div>
  );
}
