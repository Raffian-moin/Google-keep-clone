import { useState } from "react";
import { BiSolidArchiveIn } from "react-icons/bi";
import { BsBellFill, BsImageFill, BsPaletteFill, BsPersonPlusFill, BsThreeDotsVertical } from "react-icons/bs";
import NoteModal from "./NoteModal";

const MainSection = () => {
    const [open, setOpen] = useState(false);
    const handleNoteArea = () => {
        setOpen(true);
    };

    const notes = [
        {
            id: 1,
            title: "First note",
            body: "whatever"
        },
        {   id: 2,
            title: "Second note",
            body: "whatever 2"
        },
    ];

    const handleIconClick = (attributes) => {
        console.log(attributes)
    }

    const IconWrapper = ({ children }) => (
        <div className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200" onClick={() => handleIconClick(children.props)}>
            {children}
        </div>
    );

    const NoteIcons = ({noteID}) => (
        <div className="flex justify-between items-center mt-2 text-gray-500">
            <IconWrapper><BsBellFill className="cursor-pointer hover:text-gray-700" values="REMINDER" noteid={noteID} /></IconWrapper>
            <IconWrapper><BsPersonPlusFill className="cursor-pointer hover:text-gray-700" values="COLLABORATION" noteid={noteID} /></IconWrapper>
            <IconWrapper><BsPaletteFill className="cursor-pointer hover:text-gray-700" values="BACKGROUND" noteid={noteID} /></IconWrapper>
            <IconWrapper><BsImageFill className="cursor-pointer hover:text-gray-700" values="IMAGE" noteid={noteID} /></IconWrapper>
            <IconWrapper><BiSolidArchiveIn className="cursor-pointer hover:text-gray-700" values="ARCHIVE" noteid={noteID} /></IconWrapper>
            <IconWrapper><BsThreeDotsVertical className="cursor-pointer hover:text-gray-700" values="OTHERS" noteid={noteID} /></IconWrapper>
        </div>
    );

    // <div className="flex justify-between items-center mt-2 text-gray-500">
    //     <div className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200" onClick={handleIconClick}>
    //         <BsBellFill className="cursor-pointer hover:text-gray-700" values="kitao" />
    //     </div>
    // </div>

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
                    {notes.map((note, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                            <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
                            <p className="text-gray-600">{note.body}</p>
                            <NoteIcons noteID={note.id}/>
                        </div>
                    ))}
                </div>
            </main>
            <NoteModal open={open} setOpen={setOpen} />
        </>
    );
};

export default MainSection;