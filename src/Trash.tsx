import React from "react";
import { FaTrashRestore } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { useImmer } from "use-immer";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import ViewNote from "./modal/ViewNote";


const Trash = (): React.JSX.Element => {
    interface IconClickAttributeInterface {
        values: string;
        noteid: number;
    }

    const trashes = [
        {
            id: 1,
            title: "First note",
            body: "whatever"
        },
        {
            id: 2,
            title: "Second note",
            body: "whatever 2"
        },
    ];

    const [open, setOpen] = useImmer<boolean>(false);
    const [note, setNote] = useImmer({
        id: '',
        title: ''
    });

    const handleIconClick = (e, attributes: IconClickAttributeInterface) => {
        e.stopPropagation();
        const clickedButton = attributes.values;
        const noteID = attributes.noteid;

        if (clickedButton === "DELETE_FOREVER") {
            // network call
        } else if (clickedButton === "RESTORE") {
            // network call
        }
    }

    const IconWrapper = ({ children }) => (
        <div className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200" onClick={(e) => handleIconClick(e, children.props)}>
            {children}
        </div>
    );

    const NoteIcons = ({ noteID }) => (
        <div className="flex items-center mt-2 text-gray-500">
            <IconWrapper><IoTrashBin className="cursor-pointer hover:text-gray-700" values="DELETE_FOREVER" noteid={noteID} /></IconWrapper>
            <IconWrapper><FaTrashRestore className="cursor-pointer hover:text-gray-700" values="RESTORE" noteid={noteID} /></IconWrapper>
        </div>
    );

    const handleViewClick = (noteID) => {
        setOpen(true);
        const note = trashes.find((trash) => trash.id === noteID);
        setNote(note);
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />
            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header />

                <main className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {trashes.map((trash) => (
                            <div
                                key={trash.id}
                                onClick={() => handleViewClick(trash.id)}
                            >
                                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                    <h2 className="text-xl font-semibold mb-2">{trash.title}</h2>
                                    <p className="text-gray-600">{trash.body}</p>
                                    <NoteIcons noteID={trash.id} />
                                </div>
                            </div>
                        ))}
                        <ViewNote open={open} setOpen={setOpen} note={note} />
                    </div>
                </main>
            </div>
        </div>
    )
};

export default Trash;