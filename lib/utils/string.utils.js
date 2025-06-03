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

export const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
