// src/components/multi-select.jsx

import React, { useState, forwardRef } from "react";
import {
    CheckIcon,
    XCircle,
    ChevronDown,
    XIcon,
    MailSearch,
    WandSparkles,
} from "lucide-react";
import { cn } from "@lib/utils";
import { Separator } from "@components/ui/separator";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@components/ui/command";

const multiSelectVariants = (variant) => {
    const variants = {
        default:
            "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
            "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
            "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
    };
    return `m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 ${
        variants[variant || "default"]
    }`;
};

const MultiSelect = forwardRef(
    (
        {
            options,
            onValueChange,
            variant,
            defaultValue = [],
            placeholder = "Select options",
            animation = 0,
            maxCount = 3,
            modalPopover = false,
            asChild = false,
            className,
            ...props
        },
        ref
    ) => {
        const [selectedValues, setSelectedValues] = useState(defaultValue);
        const [isPopoverOpen, setIsPopoverOpen] = useState(false);
        const [isAnimating, setIsAnimating] = useState(false);

        const handleInputKeyDown = (event) => {
            if (event.key === "Enter") {
                setIsPopoverOpen(true);
            } else if (
                event.key === "Backspace" &&
                !event.currentTarget.value
            ) {
                const newSelectedValues = [...selectedValues];
                newSelectedValues.pop();
                setSelectedValues(newSelectedValues);
                onValueChange(newSelectedValues);
            }
        };

        const toggleOption = (option) => {
            const newSelectedValues = selectedValues.includes(option)
                ? selectedValues.filter((value) => value !== option)
                : [...selectedValues, option];
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        };

        const handleClear = () => {
            setSelectedValues([]);
            onValueChange([]);
        };

        const handleTogglePopover = () => {
            setIsPopoverOpen((prev) => !prev);
        };

        const clearExtraOptions = () => {
            const newSelectedValues = selectedValues.slice(0, maxCount);
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        };

        const toggleAll = () => {
            if (selectedValues.length === options.length) {
                handleClear();
            } else {
                const allValues = options.map((option) => option.value);
                setSelectedValues(allValues);
                onValueChange(allValues);
            }
        };

        return (
            <Popover
                open={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
                modal={modalPopover}
            >
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        {...props}
                        onClick={handleTogglePopover}
                        className={cn(
                            "flex p-1 rounded-md border min-h-5 h-auto items-center justify-between bg-inherit hover:bg-inherit",
                            className
                        )}
                    >
                        {selectedValues.length > 0 ? (
                            <div className="flex justify-between items-center w-full">
                                <div className="flex flex-wrap items-center">
                                    {selectedValues
                                        .slice(0, maxCount)
                                        .map((value) => {
                                            const option = options.find(
                                                (o) => o.value === value
                                            );
                                            const IconComponent = option?.icon;
                                            return (
                                                <Badge
                                                    key={value}
                                                    className={cn(
                                                        isAnimating
                                                            ? "animate-bounce"
                                                            : "",
                                                        multiSelectVariants(
                                                            variant
                                                        )
                                                    )}
                                                    style={{
                                                        animationDuration: `${animation}s`,
                                                    }}
                                                >
                                                    {IconComponent && (
                                                        <IconComponent className="h-4 w-4 mr-2" />
                                                    )}
                                                    {option?.label.length > 15
                                                        ? `${option.label.substring(
                                                              0,
                                                              15
                                                          )}...`
                                                        : option.label}
                                                    {/* <XCircle
                                                        className="ml-2 h-4 w-4 cursor-pointer"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            event.preventDefault();
                                                            toggleOption(value);
                                                        }}
                                                    /> */}
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            toggleOption(value);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        <XCircle className="ml-2 h-4 w-4" />
                                                    </div>
                                                </Badge>
                                            );
                                        })}
                                    {selectedValues.length > maxCount && (
                                        <Badge
                                            className={cn(
                                                "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                                                isAnimating
                                                    ? "animate-bounce"
                                                    : "",
                                                multiSelectVariants(variant)
                                            )}
                                            style={{
                                                animationDuration: `${animation}s`,
                                            }}
                                        >
                                            {`+ ${
                                                selectedValues.length - maxCount
                                            } more`}
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    clearExtraOptions();
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <XCircle className="ml-2 h-4 w-4" />
                                            </div>
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center justify-between z-50">
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            handleClear();
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <XIcon className="h-4 mx-2 text-muted-foreground" />
                                    </div>
                                    <Separator
                                        orientation="vertical"
                                        className="flex min-h-6 h-full"
                                    />
                                    <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full mx-auto">
                                <span className="flex items-center space-x-1 text-sm text-slate-500 italic mx-3">
                                    {placeholder}
                                </span>
                                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    onEscapeKeyDown={() => setIsPopoverOpen(false)}
                >
                    <Command>
                        <CommandInput
                            placeholder="Search..."
                            onKeyDown={handleInputKeyDown}
                        />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    key="all"
                                    onSelect={toggleAll}
                                    className="cursor-pointer"
                                >
                                    <div
                                        className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-black dark:border-white",
                                            selectedValues.length ===
                                                options.length
                                                ? "bg-primary text-primary-foreground"
                                                : "opacity-50 [&_svg]:invisible"
                                        )}
                                    >
                                        <CheckIcon className="h-4 w-4" />
                                    </div>
                                    <span>(Select All)</span>
                                </CommandItem>
                                {options.map((option, index) => {
                                    const isSelected = selectedValues.includes(
                                        option.value
                                    );
                                    return (
                                        <CommandItem
                                            key={index}
                                            onSelect={() =>
                                                toggleOption(option.value)
                                            }
                                            className="cursor-pointer flex"
                                        >
                                            <div
                                                className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-black dark:border-white",
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground"
                                                        : "opacity-50 [&_svg]:invisible"
                                                )}
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                            </div>
                                            {option.icon && (
                                                <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span>{option.label}</span>
                                            {option.number !== undefined && ( // Check if number exists
                                                <span className="ml-2 text-sm text-gray-500 flex-1 text-right dark:text-white">
                                                    ({option.number})
                                                </span> // Display the number
                                            )}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup>
                                <div className="flex items-center justify-between">
                                    {selectedValues.length > 0 && (
                                        <>
                                            <CommandItem
                                                onSelect={handleClear}
                                                className="flex-1 justify-center cursor-pointer"
                                            >
                                                Clear
                                            </CommandItem>
                                            <Separator
                                                orientation="vertical"
                                                className="flex min-h-6 h-full"
                                            />
                                        </>
                                    )}
                                    <CommandItem
                                        onSelect={() => setIsPopoverOpen(false)}
                                        className="flex-1 justify-center cursor-pointer max-w-full"
                                    >
                                        Close
                                    </CommandItem>
                                </div>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
                {animation > 0 && selectedValues.length > 0 && (
                    <WandSparkles
                        className={cn(
                            "cursor-pointer my-2 text-foreground bg-background w-3 h-3",
                            isAnimating ? "" : "text-muted-foreground"
                        )}
                        onClick={() => setIsAnimating(!isAnimating)}
                    />
                )}
            </Popover>
        );
    }
);

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;
