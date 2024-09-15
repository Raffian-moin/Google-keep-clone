import React, { useEffect, useRef } from "react";
import { BiSolidArchiveIn } from "react-icons/bi";
import { BsBellFill, BsImageFill, BsPaletteFill, BsPersonPlusFill, BsThreeDotsVertical } from "react-icons/bs";
import NoteModal from "./NoteModal";
import { useImmer } from 'use-immer'

const MainSection = () => {
    interface Notes {
        id: number;
        title: string;
        body: string;
        [key: string]: any;
    }

    interface IconClickAttributeInterface {
        values: string;
        noteid: number;
    }

    const [open, setOpen] = useImmer<boolean>(false);
    const [activeDropdown, setActiveDropdown] = useImmer<boolean>(false);
    const [notes, setNotes] = useImmer<Notes[]>([]);
    const dropdownRef = useRef<null | HTMLDivElement>(null);

    const handleNoteArea = () => {
        setOpen(true);
    };

    const staticNotes = [
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

    const handleIconClick = (attributes: IconClickAttributeInterface) => {
        const clickedButton = attributes.values;
        const noteID = attributes.noteid;

        if (clickedButton === "ARCHIVE") {
            const unarchivedNotes = notes.filter((note) => note.id !== noteID);
            setNotes(unarchivedNotes);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setNotes(staticNotes);
    }, []);

    const toggleDropdown = (noteId: number, event: React.SyntheticEvent) => {
        event.stopPropagation();
        setActiveDropdown(activeDropdown === true ? false : true);
    };

    const IconWrapper = ({ children, onClick }) => (
        <div className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200" onClick={onClick}>
            {children}
        </div>
    );

    const NoteIcons = ({ noteID }) => (
        <div className="flex justify-between items-center mt-2 text-gray-500">
            <IconWrapper onClick={() => handleIconClick({ values: "REMINDER", noteid: noteID })}>
                <BsBellFill className="cursor-pointer hover:text-gray-700" />
            </IconWrapper>
            <IconWrapper onClick={() => handleIconClick({ values: "COLLABORATION", noteid: noteID })}>
                <BsPersonPlusFill className="cursor-pointer hover:text-gray-700" />
            </IconWrapper>
            <IconWrapper onClick={() => handleIconClick({ values: "BACKGROUND", noteid: noteID })}>
                <BsPaletteFill className="cursor-pointer hover:text-gray-700" />
            </IconWrapper>
            <IconWrapper onClick={() => handleIconClick({ values: "IMAGE", noteid: noteID })}>
                <BsImageFill className="cursor-pointer hover:text-gray-700" />
            </IconWrapper>
            <IconWrapper onClick={() => handleIconClick({ values: "ARCHIVE", noteid: noteID })}>
                <BiSolidArchiveIn className="cursor-pointer hover:text-gray-700" />
            </IconWrapper>
            <IconWrapper onClick={(e: React.SyntheticEvent) => toggleDropdown(noteID, e)}>
                <BsThreeDotsVertical className="cursor-pointer hover:text-gray-700" />
            </IconWrapper>
            {activeDropdown === true && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete note</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add label</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add drawing</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Make a copy</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Show tick boxes</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Copy to Google Docs</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Version history</button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            <main className="flex-1 overflow-y-auto p-4">
                <div className="bg-white rounded-lg shadow-md mb-6 p-4">
                    <input
                        type="text"
                        placeholder="Take a note..."
                        className="w-full focus:outline-none text-lg"
                        onClick={handleNoteArea}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {notes.map((note) => (
                        <div key={note.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 relative">
                            <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
                            <p className="text-gray-600">{note.body}</p>
                            <NoteIcons noteID={note.id} />
                        </div>
                    ))}
                </div>
            </main>
            <NoteModal open={open} setOpen={setOpen} />
        </>
    );
};

export default MainSection;