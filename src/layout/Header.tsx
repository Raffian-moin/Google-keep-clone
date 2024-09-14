import React from "react";

const Header = (): React.JSX.Element => {
    return (
        <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <button className="p-2 rounded-full hover:bg-gray-200">
                        <span className="material-icons">menu</span>
                    </button>
                    <h1 className="ml-4 text-xl font-medium text-gray-700">Keep</h1>
                </div>
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search"
                        className="px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                    <button className="p-2 ml-2 rounded-full hover:bg-gray-200">
                        <span className="material-icons">refresh</span>
                    </button>
                    <button className="p-2 ml-2 rounded-full hover:bg-gray-200">
                        <span className="material-icons">view_agenda</span>
                    </button>
                    <button className="p-2 ml-2 rounded-full hover:bg-gray-200">
                        <span className="material-icons">settings</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;