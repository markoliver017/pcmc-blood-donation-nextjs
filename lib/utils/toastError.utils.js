import notify from "@components/ui/notify";

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
