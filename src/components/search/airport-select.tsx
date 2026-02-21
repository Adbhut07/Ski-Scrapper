"use client";

import * as React from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { airports, searchAirports } from "@/lib/airports";
import { Airport } from "@/types/flight";

interface AirportSelectProps {
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  label?: string;
}

export function AirportSelect({
  value,
  onChange,
  placeholder = "Select airport...",
  label,
}: AirportSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filteredAirports = React.useMemo(() => {
    if (!query) return airports.slice(0, 10);
    return searchAirports(query);
  }, [query]);

  const selectedAirport = airports.find(
    (a) => a.code === value.toUpperCase()
  );

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium leading-none text-foreground">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-11 font-normal text-left"
          >
            {selectedAirport ? (
              <span className="flex items-center gap-2 truncate">
                <span className="font-semibold text-blue-600">
                  {selectedAirport.code}
                </span>
                <span className="text-muted-foreground truncate">
                  {selectedAirport.city}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {placeholder}
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search city or airport code..."
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>No airport found.</CommandEmpty>
              <CommandGroup>
                {filteredAirports.map((airport: Airport) => (
                  <CommandItem
                    key={airport.code}
                    value={airport.code}
                    onSelect={() => {
                      onChange(airport.code);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === airport.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-blue-600">
                          {airport.code}
                        </span>
                        <span className="truncate">{airport.city}</span>
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {airport.name}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
