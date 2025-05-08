import React from "react";
import { GiFiles } from "react-icons/gi";
import { GrDashboard } from "react-icons/gr";

const Breadcrumbs = ({
    pageData = { title: "INMERS Form", icon: <GrDashboard /> }
}) => {
    const { title, icon } = pageData;
    return (
        <nav className="breadcrumbs text-sm">
            <ul>
                <li>
                    <a>
                        {icon}
                        {title}
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Breadcrumbs;
