export const formatPersonName = (value) => {
    const formatted = value
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    return formatted;
};

export const formatFormalName = (value) => {
    const formatted = value
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    return formatted;
};
