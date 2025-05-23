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

export const filterUrlWithDotSlash = (str) => {
    if (str.startsWith(".")) {
        str = str.slice(1);
    }
    if (str.endsWith("/")) {
        str = str.slice(0, -1);
    }
    return str;
};
