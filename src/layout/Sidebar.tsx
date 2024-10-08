import React from "react";
import { NavLink } from "react-router-dom";
import './../css/main.css';

const Sidebar = (): React.JSX.Element => {
    return (
        <aside className="w-64 bg-white shadow-md">
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <span className="material-icons text-yellow-500 mr-2">description</span>
                    <span className="text-gray-700 font-medium">Keep</span>
                </div>
                <nav>
                    <NavLink
                        to="/"
                        className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded"
                    >
                        <span className="material-icons mr-2">lightbulb</span>
                        Notes
                    </NavLink>
                    <a
                        href="#"
                        className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded"
                    >
                        <span className="material-icons mr-2">notifications</span>
                        Reminders
                    </a>
                    <a
                        href="#"
                        className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded"
                    >
                        <span className="material-icons mr-2">label</span>
                        Labels
                    </a>
                    <NavLink
                        to="/archive"
                        className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded"
                    >
                        <span className="material-icons mr-2">archive</span>
                        Archive
                    </NavLink>

                    <NavLink
                        to="/trash"
                        className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded"
                    >
                        <span className="material-icons mr-2">delete</span>
                        Trash
                    </NavLink>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;