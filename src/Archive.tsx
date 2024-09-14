import React from "react";
import { BsBellFill, BsImageFill, BsPaletteFill, BsPersonPlusFill, BsThreeDotsVertical } from "react-icons/bs";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import { BiSolidArchiveIn } from "react-icons/bi";

const Archive = (): React.JSX.Element => {
    const archives = [
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

    const handleIconClick = (attributes) => {
        console.log(attributes)
    }

    const IconWrapper = ({ children }) => (
        <div className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200" onClick={() => handleIconClick(children.props)}>
            {children}
        </div>
    );

    const NoteIcons = ({ noteID }) => (
        <div className="flex justify-between items-center mt-2 text-gray-500">
            <IconWrapper><BsBellFill className="cursor-pointer hover:text-gray-700" values="REMINDER" noteid={noteID} /></IconWrapper>
            <IconWrapper><BsPersonPlusFill className="cursor-pointer hover:text-gray-700" values="COLLABORATION" noteid={noteID} /></IconWrapper>
            <IconWrapper><BsPaletteFill className="cursor-pointer hover:text-gray-700" values="BACKGROUND" noteid={noteID} /></IconWrapper>
            <IconWrapper><BsImageFill className="cursor-pointer hover:text-gray-700" values="IMAGE" noteid={noteID} /></IconWrapper>
            <IconWrapper><BiSolidArchiveIn className="cursor-pointer hover:text-gray-700" values="ARCHIVE" noteid={noteID} /></IconWrapper>
            <IconWrapper><BsThreeDotsVertical className="cursor-pointer hover:text-gray-700" values="OTHERS" noteid={noteID} /></IconWrapper>
        </div>
    );

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
                        {archives.map((archive, index) => (
                            <div key={archive.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                <h2 className="text-xl font-semibold mb-2">{archive.title}</h2>
                                <p className="text-gray-600">{archive.body}</p>
                                <NoteIcons noteID={archive.id} />
                            </div>
                        ))}
                    </div>
                </main>

            </div>
        </div>
    )
};

export default Archive;