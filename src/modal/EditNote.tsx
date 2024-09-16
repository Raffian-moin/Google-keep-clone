import React, { useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { RxCross1 } from "react-icons/rx";
import { useImmer } from 'use-immer';
import { GoPlus } from "react-icons/go";


type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditNote({ open, setOpen, setEditNote, editNote, setNoteCheckBoxes, noteCheckBoxes }: Props) {

    const handleNoteSave = () => {
        setOpen(false)
    }

    const handleAddNewItem = (e) => {
        console.log(e.key === "Enter");
    }

    const handleItemDelete = (e, checkboxID: number) => {
        // console.log(checkboxID);
        setNoteCheckBoxes((draft) => {
            const index = draft.findIndex((item) => item.id === checkboxID);
            draft.splice(index, 1)
        });
    }

    const handleItemChange = (e, checkboxID: number) => {
        console.log(checkboxID);
        e.stopPropagation();
        setNoteCheckBoxes((draft) => {
            const currentItem = draft.find((item) => item.id === checkboxID);
            currentItem.item = e.target.value;
        });
    }




    return (
        <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        {noteCheckBoxes.length > 0 && (
                            <>
                                {noteCheckBoxes.map((checkbox) => (
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4" key={checkbox.id}>
                                        {/* First Div */}
                                        <div className="flex items-center w-full max-w-md mx-auto bg-white border border-gray-300 rounded-md shadow-sm">
                                            <div className="flex items-center justify-center pl-3">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                className="flex-grow px-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                                                placeholder="Search..."
                                                value={checkbox.item}
                                                onChange={(e) => handleItemChange(e, checkbox.id)}
                                            />
                                            <button
                                                className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                                                onClick={(e) => handleItemDelete(e, checkbox.id)}
                                            >
                                                <RxCross1 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Second Div, printed once after the loop */}
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div
                                        className="flex items-center w-full max-w-md mx-auto bg-white border border-gray-300 rounded-md shadow-sm"
                                        onKeyDown={handleAddNewItem}
                                    >
                                        <div className="flex items-center justify-center pl-3">
                                            <GoPlus size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            className="flex-grow px-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                                            placeholder="Search..."
                                        />
                                    </div>
                                </div>
                            </>
                        )}


                        {editNote && (
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <textarea id="message" className="block p-2.5 w-full text-sm rounded-lg border"></textarea>
                            </div>
                        )}

                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                data-autofocus
                                onClick={handleNoteSave}
                                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-500 sm:mt-0 sm:w-auto"
                            >
                                Close
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}