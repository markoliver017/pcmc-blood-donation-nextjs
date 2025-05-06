import { forwardRef } from "react";

/*
    menu: This refers to the dropdown menu that appears when you click on the select input. You can customize its appearance, such as padding and background color.
    control: This refers to the main container of the select input, where you type or select an option. You can customize its appearance based on different modes (e.g., light or dark mode).
    singleValue: This refers to the selected value displayed in the select input when a single option is selected. You can customize its appearance, including background color, text color, padding, and border.

    option: This refers to the individual options displayed in the dropdown menu. You can customize their appearance, including background color, text color, border radius, and hover effects.
    container: The outer container of the select component.

    valueContainer: The container for the selected value(s).

    indicatorSeparator: The separator between the select input and the dropdown indicator.

    indicatorsContainer: The container for the dropdown indicator and clear indicator.

    multiValue: The container for the selected value(s) when multiple options are selected.

    multiValueLabel: The label for the selected value(s) when multiple options are selected.

    multiValueRemove: The remove button for the selected value(s) when multiple options are selected.

    clearIndicator: The clear indicator (e.g., "x" button) to clear the selected value(s).

    dropdownIndicator: The dropdown indicator (e.g., arrow icon) to open the options menu.

    group: The container for grouped options.

    groupHeading: The heading for grouped options.
*/

// Custom Styles Object
// export const customStyle = {
//     placeholder: (provided) => ({
//         ...provided,
//         color: 'gray',
//         fontSize: '14px',
//         opacity: 0.8,
//     }),
//     control: (base, state) => ({
//         ...base,
//         maxHeight: '120px',
//         overflowY: 'auto',
//         borderColor: state.isFocused ? '#2684FF' : base.borderColor,
//     }),
//     menu: (base) => ({
//         ...base,
//         maxHeight: '200px',
//         width: '90%',
//         right: '0',
//         overflowY: 'auto',
//         padding: '5px',
//         zIndex: 9999,
//     }),
//     multiValueContainer: (base) => ({
//         ...base,
//         maxWidth: '100%',
//     }),
// };

// export const getCollaboratorsStyles = (mode) => {

//     return {
//         menu: (provided) => ({
//             ...provided,
//             width: 'max-w-max',
//             left: '0',
//             backgroundColor: "#e1e5f5",
//             padding: "5px",
//         }),
//         placeholder: (provided) => ({
//             ...provided,
//             color: 'gray',
//             fontSize: '14px',
//             opacity: 0.8,
//         }),
//         control: (provided) => ({
//             ...provided,
//             backgroundColor: mode === "light" ? "#F9FAFB" : "#374151",
//         }),
//         groupHeading: (provided) => ({
//             ...provided,
//             color: "#4A5568",
//             fontWeight: "bold",
//             fontSize: "14px",
//             padding: "5px 10px",
//             textDecoration: "underline",
//         }),
//         multiValue: (provided) => ({
//             ...provided,
//             backgroundColor: "#E0E7FF",
//             borderRadius: "50px",
//             padding: "5px",
//             display: "flex",
//             alignItems: "center",
//             position: "relative",
//             paddingRight: "20px",
//             maxHeight: '25px',
//         }),
//         multiValueRemove: (provided) => ({
//             ...provided,
//             position: "absolute", // Position it absolutely within the multiValue container
//             top: "2px",
//             right: "2px",
//             color: "#ff6347",
//             cursor: "pointer",
//             borderRadius: "60%",
//             backgroundColor: "transparent",
//             ':hover': {
//                 backgroundColor: "#ff6347",
//                 color: "#fff",
//             },
//         }),
//         option: (provided, { isDisabled }) => {
//             return {
//                 ...provided,
//                 backgroundColor: isDisabled ? '#f5f5f5' : provided.backgroundColor, // Soft gray for disabled
//                 color: isDisabled ? '#bcbcbc' : provided.color,                    // Muted text color
//                 cursor: isDisabled ? 'not-allowed' : 'pointer',                    // Indicate inactivity
//                 opacity: isDisabled ? 0.7 : 1,                                     // Faded appearance
//                 pointerEvents: isDisabled ? 'none' : 'auto',
//             }
//         },
//     }
// };

// export const collaboratorsCustomMultiValueLabel = (props) => {
//     const { data, selectProps } = props;

//     return (

//         <components.MultiValueLabel {...props}>
//             <div className="flex items-center space-x-5">
//                 <Avatar
//                     img={data.avatarUrl || undefined}
//                     rounded={true}
//                     size="base"
//                     placeholderInitials={getInitials(data.label)}
//                     title={data.label}
//                     className='w-5 h-5'

//                 />
//                 {/* Only show label if fewer than 2 items are selected */}
//                 {selectProps.value.length < 4 && (
//                     <span className="ml-2">{data.label}</span>
//                 )}
//             </div>
//         </components.MultiValueLabel>

//     );
// };

// export const getLabelsStyles = (mode) => {
//     return {
//         menu: (provided) => ({
//             ...provided,
//             width: 'max-w-max',
//             left: '0',
//             margin: "5px 0",
//             // backgroundColor: "#e1e5f5",
//             backgroundColor: mode === "light" ? "#F9FAFB" : "rgba(55, 65, 81, 1)",
//             padding: "10px",
//         }),
//         control: (provided) => ({
//             ...provided,
//             backgroundColor: mode === "light" ? "#F9FAFB" : "#374151",
//         }),
//         groupHeading: (provided) => ({
//             ...provided,
//             color: mode === "light" ? "#4A5568" : "#fff",
//             fontWeight: "bold",
//             fontSize: "14px",
//             padding: "5px 10px",
//             textDecoration: "underline",
//         }),
//         singleValue: (provided, { data }) => ({
//             ...provided,
//             backgroundColor: data?.color || '#fff',
//             color: isColorDark(data?.color || '#fff') ? 'white' : 'black',
//             borderRadius: "50px",
//             border: '1px solid gray',
//             maxWidth: 'max-content',
//             padding: '3px 8px',
//         }),
//         singleValueLabel: (provided, { data }) => {
//             const isDark = isColorDark(data?.color || '#fff');
//             return {
//                 ...provided,
//                 color: isDark ? 'white' : 'black',
//             }
//         },
//         // singleValueRemove: (provided) => ({
//         //     ...provided,
//         //     color: 'white',
//         //     ':hover': {
//         //         backgroundColor: '#ff6347',
//         //         color: 'white',
//         //     },
//         // }),
//         option: (provided, { data, isDisabled }) => {
//             const isDark = isColorDark(data?.color || '#fff');
//             return {
//                 ...provided,
//                 backgroundColor: isDisabled ? 'lightgray' : data?.color,
//                 borderRadius: "10px",
//                 color: isDisabled ? 'gray' : isDark ? 'white' : 'black',
//                 margin: '5px 0',
//                 ':hover': {
//                     border: '1px solid gray',
//                     color: isColorDark(data?.color || '#fff') ? 'lightBlue' : 'blue',
//                 },
//             }
//         },
//     }
// }

// export const getLabelsStyles2 = (mode) => {
//     return {
//         menu: (provided) => ({
//             ...provided,
//             width: '90%',
//             right: '0',
//             backgroundColor: mode == "light" ? "#F9FAFB" : "#374151",
//             padding: "5px",
//         }),
//         control: (provided) => ({
//             ...provided,
//             backgroundColor: mode === "light" ? "#F9FAFB" : "#374151",
//         }),
//         singleValue: (provided, { data }) => ({
//             ...provided,
//             color: mode == "light" ? 'black' : 'white',
//             padding: '3px 8px',
//         }),
//         singleValueLabel: (provided, { data }) => {
//             const isDark = mode == "light";
//             return {
//                 ...provided,
//                 color: isDark ? 'white' : 'black',
//             }
//         },
//         option: (provided, { data, isDisabled }) => {
//             const isDark = mode == "light";
//             return {
//                 ...provided,
//                 backgroundColor: isDisabled ? 'lightgray' : data?.color,
//                 color: isDisabled ? 'gray' : isDark ? 'black' : 'white',
//                 ':hover': {
//                     color: mode == "light" ? 'darkblue' : 'blue',
//                 },
//             }
//         },
//     }
// }

export const getSingleStyle = (mode) => {
    return {
        menu: (provided) => ({
            //dropdown menu options container
            ...provided,
            padding: "5px",
            backgroundColor: mode === "light" ? "#F9FAFB" : "#374151",
        }),
        control: (provided) => ({
            //select input where u type
            ...provided,
            color: "green",
            backgroundColor: mode === "light" ? "#F9FAFB" : "#1D232A",
        }),
        singleValue: (provided, { data }) => {
            //selected value displayed in the select input
            return {
                ...provided,
                // backgroundColor: data?.color,
                color: mode === "light" ? "#000" : "#fff",
                maxWidth: "100%",
                padding: "3px 8px",
                borderRadius: "10px",
                border: "1px solid gray",
            };
        },
        option: (provided, { data, isFocused, isSelected }) => {
            return {
                ...provided,
                // borderRadius: '10px',
                color:
                    mode === "light"
                        ? isFocused
                            ? "#000"
                            : "black"
                        : isFocused
                        ? "#fff"
                        : "#fff",
                backgroundColor:
                    mode === "light"
                        ? isFocused
                            ? "#D0EFFF" // Light blue for focused option
                            : "#fff"
                        : isFocused
                        ? "#3A3A3A" // Dark gray for focused option
                        : "#2C2C2C",
                ":hover": {
                    backgroundColor: mode === "light" ? "#E0E0E0" : "#1E1E1E", // Light gray for light mode, dark gray for dark mode
                },
                ":hover div": {
                    backgroundColor: "inherit", // Ensure the label background color matches the option background color on hover
                },
                ...(isSelected && {
                    backgroundColor: mode === "light" ? "#C8E6C9" : "#388E3C", // Light green for light mode, dark green for dark mode
                    color: mode === "light" ? "#000" : "#fff", // Dark text for light mode, light text for dark mode
                }),
                ...(isFocused && {
                    backgroundColor: mode === "light" ? "#D0EFFF" : "#3A3A3A", // Light blue for light mode, dark gray for dark mode
                    color: mode === "light" ? "#000" : "#fff", // Dark text for light mode, light text for dark mode
                }),
            };
        },
        input: (provided) => ({
            ...provided,
            color: mode === "light" ? "black" : "white", // Set the input text color based on the mode
        }),
    };
};

// export const getSingleStyles = (mode) => {
//     return {
//         menu: (provided) => ({
//             ...provided,
//             width: 'max-w-max',
//             left: '0',
//             padding: "5px",
//             // backgroundColor: "#e1e5f5",
//             backgroundColor: mode === "light" ? "#F9FAFB" : "rgba(55, 65, 81, 0.7)",
//         }),
//         control: (provided) => ({
//             ...provided,
//             backgroundColor: mode === "light" ? "#F9FAFB" : "#374151",
//         }),
//         singleValue: (provided, { data }) => {
//             const isDark = isColorDark(data?.color || '#fff');
//             return {
//                 ...provided,
//                 backgroundColor: data?.color,
//                 color: isDark ? 'white' : 'black',
//                 maxWidth: 'max-content',
//                 padding: '3px 8px',
//                 borderRadius: "50px",
//                 border: '1px solid gray',
//             }
//         },
//         option: (provided, { data }) => {
//             const isDark = isColorDark(data?.color || '#fff');
//             return {
//                 ...provided,
//                 backgroundColor: data?.color,
//                 borderRadius: "10px",
//                 color: isDark ? 'white' : 'black',
//                 margin: '5px 0',
//                 ':hover': {
//                     color: 'blue',
//                 },
//             }
//         },
//     }
// }
