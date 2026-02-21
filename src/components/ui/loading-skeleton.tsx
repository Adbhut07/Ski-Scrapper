import { Card } from "@/components/ui/card";

export function FlightCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50 p-0">
      <div className="p-4 sm:p-6 animate-pulse">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          {/* Airline */}
          <div className="flex items-center gap-3 lg:w-44">
            <div className="h-10 w-10 rounded-lg bg-muted" />
            <div className="space-y-1.5">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
          </div>

          {/* Journey */}
          <div className="flex-1 flex items-center gap-4">
            <div className="text-center">
              <div className="h-6 w-16 rounded bg-muted mx-auto mb-1" />
              <div className="h-3 w-10 rounded bg-muted mx-auto" />
            </div>
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="h-3 w-12 rounded bg-muted" />
              <div className="w-full h-px bg-muted" />
              <div className="h-4 w-16 rounded-full bg-muted" />
            </div>
            <div className="text-center">
              <div className="h-6 w-16 rounded bg-muted mx-auto mb-1" />
              <div className="h-3 w-10 rounded bg-muted mx-auto" />
            </div>
          </div>

          {/* Price */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 lg:min-w-[150px] pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-border/50 lg:pl-6">
            <div>
              <div className="h-7 w-24 rounded bg-muted mb-1" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
            <div className="h-10 w-40 rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function FlightResultsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">
          Searching for the best flights...
        </p>
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <FlightCardSkeleton key={i} />
      ))}
    </div>
  );
}
