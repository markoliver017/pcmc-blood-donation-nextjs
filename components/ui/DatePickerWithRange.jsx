"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover";

export function DatePickerWithRange({
    className,
    date,
    onDateChange, // Renamed from onSelect for clarity
}) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSelect = (selectedDate) => {
        console.log(selectedDate);
        // if (onDateChange) {
        //     onDateChange(selectedDate);
        // }
        // if (selectedDate?.to) {
        //     setIsOpen(false);
        // }
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onDayClick={(day) =>
                            onDateChange((prev) =>
                                prev?.to
                                    ? { from: day, to: undefined }
                                    : prev?.from
                                    ? { from: prev?.from, to: day }
                                    : { from: day, to: undefined }
                            )
                        }
                        numberOfMonths={2}
                        weekStartsOn={1}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
