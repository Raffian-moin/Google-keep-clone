import React, { useEffect, useRef } from "react";
import { BiSolidArchiveIn } from "react-icons/bi";
import { BsBellFill, BsCheck, BsImageFill, BsPaletteFill, BsPersonPlusFill, BsThreeDotsVertical } from "react-icons/bs";
import { useImmer } from 'use-immer';
import AddNote from "./modal/AddNote";
import EditNote from "./modal/EditNote";
import JSONNoteData from './data.json'

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

    const [openAddNoteModal, setOpenAddNoteModal] = useImmer<boolean>(false);
    const [openEditNoteModal, setOpenEditNoteModal] = useImmer<boolean>(false);
    const [editNote, setEditNote] = useImmer(null);
    const [activeDropdown, setActiveDropdown] = useImmer<number | null>(null);
    const [notes, setNotes] = useImmer<Notes[]>([]);
    const dropdownRef = useRef<null | HTMLDivElement>(null);
    const [noteCheckBoxes, setNoteCheckBoxes] = useImmer([]);
    const [selectedNotes, setSelectedNotes] = useImmer<number[]>([]);

    const handleNoteArea = () => {
        setOpenAddNoteModal(true);
    };

    const handleIconClick = (e, attributes: IconClickAttributeInterface) => {
        e.stopPropagation();
        const clickedButton = attributes.values;
        const noteID = attributes.noteid;

        if (clickedButton === "ARCHIVE") {
            const unarchivedNotes = notes.filter((note) => note.id !== noteID);
            setNotes(unarchivedNotes);
        }
    }

    const handleNoteEdit = (e, noteID) => {
        e.stopPropagation();
        if (selectedNotes.includes(noteID)) {
            setSelectedNotes(draft => {
                const index = draft.findIndex(id => id === noteID);
                if (index !== -1) draft.splice(index, 1);
            });
        } else if (selectedNotes.length > 0) {
            setSelectedNotes(draft => {
                draft.push(noteID);
            });
        } else {
            setOpenEditNoteModal(true);
            setNoteCheckBoxes([]);
            setEditNote(null);
            const note = JSONNoteData.find((item) => item.id === noteID);
            if (note.is_checkbox) {
                setNoteCheckBoxes(note.body)
            } else {
                setEditNote(note);
            }
        }

    }

    const handleNoteSelection = (e, noteID) => {
        e.stopPropagation();
        if (selectedNotes.includes(noteID)) {
            setSelectedNotes(draft => {
                const index = draft.findIndex(id => id === noteID);
                if (index !== -1) draft.splice(index, 1);
            });
        } else {
            setSelectedNotes(draft => {
                draft.push(noteID);
            });
        }

    }

    const handleDeleteNote = (e, noteID) => {
        e.stopPropagation();
        setNotes((draft) => {
            const index = draft.findIndex((item) => item.id === noteID);
            draft.splice(index, 1)
        });
    }

    const handleMakeNoteCopy = (e, noteID) => {
        e.stopPropagation();
        // Make API call to store the copied note
        // use ID of note that is returned from API
        setNotes((draft) => {
            const noteToBeCopied = draft.find((item) => item.id === noteID);
            // FIXME: When implemented API call, ID should be ID of return data
            const CopiedNote = {...noteToBeCopied};
            CopiedNote.id = Math.random();
            draft.push(CopiedNote);
        });
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setNotes(JSONNoteData);
    }, []);

    const toggleDropdown = (noteId: number, event: React.SyntheticEvent) => {
        event.stopPropagation();
        setActiveDropdown(activeDropdown === noteId ? null : noteId);
    };

    const IconWrapper = ({ children, onClick }) => (
        <div className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200" onClick={onClick}>
            {children}
        </div>
    );

    const NoteIcons = ({ noteID }) => (
        <div className="flex justify-between items-center mt-2 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <IconWrapper onClick={(e) => handleIconClick(e, { values: "REMINDER", noteid: noteID })}>
                <BsBellFill className="cursor-pointer hover:text-gray-700" />
            </IconWrapper>
            <IconWrapper onClick={(e) => handleIconClick(e, { values: "COLLABORATION", noteid: noteID })}>
                <BsPersonPlusFill className="cursor-pointer hover:text-gray-700" />
            </IconWrapper>
            <IconWrapper onClick={(e) => handleIconClick(e, { values: "BACKGROUND", noteid: noteID })}>
                <BsPaletteFill className="cursor-pointer hover:text-gray-700" />
            </IconWrapper>
            <IconWrapper onClick={(e) => handleIconClick(e, { values: "IMAGE", noteid: noteID })}>
                <BsImageFill className="cursor-pointer hover:text-gray-700" />
            </IconWrapper>
            <IconWrapper onClick={(e) => handleIconClick(e, { values: "ARCHIVE", noteid: noteID })}>
                <BiSolidArchiveIn className="cursor-pointer hover:text-gray-700" />
            </IconWrapper>
            <IconWrapper onClick={(e: React.SyntheticEvent) => toggleDropdown(noteID, e)}>
                <BsThreeDotsVertical className="cursor-pointer hover:text-gray-700" />
            </IconWrapper>
            {activeDropdown === noteID && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={(e) => handleDeleteNote(e, noteID)}>Delete note</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add label</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add drawing</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={(e) => handleMakeNoteCopy(e, noteID)}>Make a copy</button>
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
                        <div key={note.id} className="relative group" onClick={(e) => handleNoteEdit(e, note.id)}>
                            <div
                                className={`absolute -top-2 -left-2 z-10 transition-opacity duration-200 ${selectedNotes.includes(note.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                onClick={(e) => handleNoteSelection(e, note.id)}
                            >
                                <div className="bg-black rounded-full p-1 shadow-md">
                                    <BsCheck className={`${selectedNotes.includes(note.id) ? 'text-neutral-500' : 'text-white'} text-xl`} />
                                </div>
                            </div>
                            <div className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ${selectedNotes.includes(note.id) ? 'ring-2 ring-current' : ''
                                }`}>
                                <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
                                <p className="text-gray-600">{note.is_checkbox === false ? note.body.replace(/^(.{200}[^\s]*).*/, "$1") : ''}</p>
                                {(selectedNotes.length === 0) && (
                                    <NoteIcons noteID={note.id} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <AddNote open={openAddNoteModal} setOpen={setOpenAddNoteModal} />
            <EditNote
                open={openEditNoteModal}
                setOpen={setOpenEditNoteModal}
                noteCheckBoxes={noteCheckBoxes}
                setNoteCheckBoxes={setNoteCheckBoxes}
                editNote={editNote}
                setEditNote={setEditNote}
            />
        </>
    );
};

export default MainSection;