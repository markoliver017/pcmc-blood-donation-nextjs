
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportToExcel(data, filename) {
    if (!data.length) return;

    // Step 1: Extract and transform headers
    const originalKeys = Object.keys(data[0]);

    const headerMap = originalKeys.reduce((acc, key) => {
        const formatted = key.replace(/[_\.]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Capitalize each word
        acc[key] = formatted;
        return acc;
    }, {});

    // Step 2: Create a new data array with readable headers as the first row
    const formattedData = data.map(row => {
        const newRow = {};
        for (const key in headerMap) {
            newRow[headerMap[key]] = row[key];
        }
        return newRow;
    });

    // Step 3: Generate worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
    });

    const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(blob, filename + '.xlsx');
}

// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

// export function exportToExcel(data, filename) {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

//     const excelBuffer = XLSX.write(workbook, {
//         bookType: 'xlsx',
//         type: 'array',
//     });

//     const blob = new Blob([excelBuffer], {
//         type:
//             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
//     });

//     saveAs(blob, filename + '.xlsx');
// }
