
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function SweetAlert({
    title = 'Notification',
    text = "",
    html = "",
    icon = 'warning',
    showCancelButton = false,
    confirmButtonText = 'Yes',
    cancelButtonText = 'Cancel',
    onConfirm = () => { },
    onCancel = () => { },
    element_id = 'form-modal',
}) {
    MySwal.fire({
        target: document.getElementById(element_id),
        title: <p>{title}</p>,
        text,
        html,
        icon,
        showCancelButton,
        confirmButtonText,
        cancelButtonText,
    }).then((result) => {
        if (result.isConfirmed && typeof onConfirm === 'function') {
            onConfirm();
        } else if (
            result.dismiss === Swal.DismissReason.cancel &&
            typeof onCancel === 'function'
        ) {
            onCancel();
        }
    });
}
