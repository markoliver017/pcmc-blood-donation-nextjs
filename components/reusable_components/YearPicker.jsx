// components/YearPicker.js
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function YearPicker({ selectedYear, onChange }) {
    const [date, setDate] = useState(selectedYear || new Date());

    const handleChange = (date) => {
        setDate(date);
        onChange && onChange(date);
    };

    return (
        <DatePicker
            selected={date}
            onChange={handleChange}
            showYearPicker
            dateFormat="yyyy"
            className="border p-2 rounded w-20"
        />
    );
}
