import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import React, { useEffect, useRef } from 'react';
import { RxCross1 } from "react-icons/rx";
import { useImmer } from 'use-immer';

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditNote({ open, setOpen, setEditNote, editNote, setNoteCheckBoxes, noteCheckBoxes }: Props) {
    const addNewItemRef = useRef(null);
    const noteCheckBoxItemRef = useRef(null);
    const [currentCheckboxID, SetCurrentCheckboxID] = useImmer(null);

    const handleNoteSave = () => {
        setOpen(false)
    }

    const handleAddNewItem = (e) => {
        e.stopPropagation();
        const sortOrder = noteCheckBoxes[noteCheckBoxes.length - 1].sort_order + 1;
        setNoteCheckBoxes((draft) => {
            draft.push({ sort_order: sortOrder, item: e.target.value });
        });

        SetCurrentCheckboxID(sortOrder);
        addNewItemRef.current.value = '';
    }

    const handleItemDelete = (e, checkboxID: number) => {
        setNoteCheckBoxes((draft) => {
            const index = draft.findIndex((item) => item.sort_order === checkboxID);
            draft.splice(index, 1)
        });
    }

    const handleItemChange = (e, checkboxID: number) => {
        e.stopPropagation();
        setNoteCheckBoxes((draft) => {
            const currentItem = draft.find((item) => item.sort_order === checkboxID);
            currentItem.item = e.target.value;
        });
    }

    const handleKeyDown = (e, checkboxID: number, key: number) => {
        e.stopPropagation();
        if (e.key === "Enter") {
            if (noteCheckBoxes.length === key + 1) {
                addNewItemRef.current.focus();
            } else {
                const index = noteCheckBoxes.findIndex((item) => item.sort_order === checkboxID);

                const currentCheckboxItem = {
                    sort_order: checkboxID + 1,
                    item: ''
                };

                if ((noteCheckBoxes[index + 1].sort_order - checkboxID) === 1) {
                    const firstHalf = noteCheckBoxes.slice(0, index + 1);   // Elements before the index
                    const secondHalf = noteCheckBoxes.slice(index + 1);     // Elements from the index onwards

                    let incrementedSortOrder = 10;
                    const updatedSecondHalf = secondHalf.map((item, idx) => {
                        if (idx === 0) {
                            incrementedSortOrder += secondHalf[idx].sort_order
                            return { ...item, sort_order: incrementedSortOrder };
                        } else {
                            incrementedSortOrder += 1
                            return { ...item, sort_order: incrementedSortOrder };
                        }
                    });

                    setNoteCheckBoxes([...firstHalf, currentCheckboxItem, ...updatedSecondHalf]);
                } else {
                    setNoteCheckBoxes((draft) => {
                        draft.splice(index + 1, 0, currentCheckboxItem);
                    });
                }

                SetCurrentCheckboxID(checkboxID + 1);
            }
        }
    }

    function getMap() {
        if (!noteCheckBoxItemRef.current) {
            noteCheckBoxItemRef.current = new Map();
        }
        return noteCheckBoxItemRef.current;
    }


    useEffect(() => {
        const map = getMap();
        const currentInputItem = map.get(currentCheckboxID);
        if (currentInputItem) {
            currentInputItem?.focus();
        }

    }, [currentCheckboxID]);

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
                                {noteCheckBoxes.map((checkbox, index) => (
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4" key={checkbox.sort_order}>
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
                                                placeholder="List item"
                                                value={checkbox.item}
                                                onChange={(e) => handleItemChange(e, checkbox.sort_order)}
                                                onKeyDown={(e) => handleKeyDown(e, checkbox.sort_order, index)}
                                                ref={(node) => {
                                                    const map = getMap();
                                                    if (node) {
                                                        map.set(checkbox.sort_order, node);
                                                    } else {
                                                        map.delete(checkbox.sort_order);
                                                    }
                                                }}
                                            />
                                            <button
                                                className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                                                onClick={(e) => handleItemDelete(e, checkbox.sort_order)}
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
                                        onChange={(e) => handleAddNewItem(e)}
                                    >
                                        <input
                                            type="text"
                                            className="flex-grow px-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                                            placeholder="List item"
                                            ref={addNewItemRef}
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