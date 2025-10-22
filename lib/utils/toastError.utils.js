import notify from "@components/ui/notify";
import { toast } from "sonner";

export const toastError = (error) => {
    let detailContent = "";
    const { errorArr: details, message } = error;

    detailContent = (
        <ul className="list-disc list-inside">
            {details.map((err, index) => (
                <li key={index}>{err}</li>
            ))}
        </ul>
    );
    notify({
        error: true,
        message: (
            <div tabIndex={0} className="collapse">
                <input type="checkbox" />
                <div className="collapse-title font-semibold">
                    {message}
                    <br />
                    <small className="link link-warning">See details</small>
                </div>
                <div className="collapse-content text-sm">{detailContent}</div>
            </div>
        ),
    });
};
export const toastCatchError = (error, setError) => {
    let detailContent = "";
    const { errors, message } = error;
    if (errors?.length) {
        errors.forEach((err) => {
            setError(err.field, {
                type: "custom",
                message: err.message,
            });
        });
        detailContent = (
            <ul className="list-disc list-inside">
                {errors.map((err, index) => (
                    <li key={index}>
                        {err.field.toUpperCase()}: {err.message} - ({err.value})
                    </li>
                ))}
            </ul>
        );
    }

    notify({
        error: true,
        message: (
            <div tabIndex={0} className="collapse">
                <input type="checkbox" />
                <div className="collapse-title font-semibold">
                    {message}
                    <br />
                    <small className="link link-warning">See details</small>
                </div>
                <div className="collapse-content text-sm">{detailContent}</div>
            </div>
        ),
    });
};

export const toastOnDialogCatchError = (error, setError) => {
    let detailContent = "";
    const { errors, message } = error;

    if (errors?.length) {
        errors.forEach((err) => {
            setError(err.field, {
                type: "custom",
                message: err.message,
            });
        });
        detailContent = (
            <>
                <br />
                <small className="link link-warning">See details</small>
                <ul className="list-disc list-inside">
                    {errors.map((err, index) => (
                        <li key={index}>
                            {err.field.toUpperCase()}: {err.message} - (
                            {err.value})
                        </li>
                    ))}
                </ul>
            </>
        );
    }

    toast.custom((t) => (
        <div
            tabIndex={0}
            className="collapse dark:bg-slate-600 border border-red-400 p-2"
        >
            <input type="checkbox" />
            <div className="collapse-title font-semibold">{message}</div>
            <div className="collapse-content text-sm">{detailContent}</div>
            <button className="btn" onClick={() => toast.dismiss(t)}>
                Dismiss
            </button>
        </div>
    ));
};
