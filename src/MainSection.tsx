import React from "react";
import { useState } from 'react'
import NoteModal from "./NoteModal";

const MainSection = (): React.JSX.Element => {
    const [open, setOpen] = useState(false)
    const handleNoteArea = () => {
        setOpen(true);
    }
    return (
        <>
            <main className="flex-1 overflow-y-auto p-4">
                {/* Note input */}
                <div className="bg-white rounded-lg shadow-md mb-6 p-4">
                    <input
                        type="text"
                        placeholder="Take a note..."
                        className="w-full focus:outline-none text-lg"
                        onClick={handleNoteArea}
                    />
                </div>
                {/* Notes grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Note 1 */}
                    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <h2 className="text-xl font-semibold mb-2">Note Title</h2>
                        <p className="text-gray-600">
                            This is the content of the note. It can be a short reminder or a
                            longer text.
                        </p>
                    </div>
                    {/* Note 2 */}
                    <div className="bg-yellow-100 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <h2 className="text-xl font-semibold mb-2">Important Reminder</h2>
                        <p className="text-gray-600">
                            Don't forget to buy groceries on your way home!
                        </p>
                    </div>
                    {/* Add more notes as needed */}
                </div>
            </main>
            <NoteModal
                open={open}
                setOpen={setOpen}
            />
        </>

    );
};

export default MainSection;