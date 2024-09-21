import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import React, { useEffect, useRef } from 'react';
import { GoChevronDown, GoChevronRight } from 'react-icons/go';
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
    const [isCompletedTasksCollapsed, SetIsCompletedTasksCollapsed] = useImmer(false);

    const incompletedTasks = (noteCheckBoxes.filter((item) => item.is_checked === false));
    const completedTasks = (noteCheckBoxes.filter((item) => item.is_checked === true));

    const handleNoteSave = () => {
        setOpen(false)
    }

    const handleAddNewItem = (e) => {
        e.stopPropagation();
        const character = e.target.value
        if (character) {
            const sortOrder = noteCheckBoxes[noteCheckBoxes.length - 1].sort_order + 1;
            setNoteCheckBoxes((draft) => {
                draft.push({ sort_order: sortOrder, item: character, is_checked: false });
            });

            SetCurrentCheckboxID(sortOrder);
            addNewItemRef.current.value = '';
        }
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
        // If user hits enter button then add a new input field below
        if (e.key === "Enter") {
            // If user hits enter on incompleted last input field then do not add a new field below
            // because there is already an open input field
            if (incompletedTasks[incompletedTasks.length - 1].sort_order === checkboxID) {
                addNewItemRef.current.focus();
            } else {
                // always add a new input field
                // user hits enter button to insert between checkboxes or from the last checkbox of incomplete checkbox

                const index = noteCheckBoxes.findIndex((item) => item.sort_order === checkboxID);

                const currentCheckboxItem = {
                    sort_order: checkboxID + 1,
                    item: '',
                    is_checked: noteCheckBoxes[index].is_checked ?? false,
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

    const handleCheckBox = (e, checkboxID) => {
        setNoteCheckBoxes((draft) => {
            const currentItem = draft.find((item) => item.sort_order === checkboxID);
            currentItem.is_checked = !currentItem.is_checked;
        });
    }

    const handleCompletedTaskSectionCollapse = () => {
        SetIsCompletedTasksCollapsed(!isCompletedTasksCollapsed);
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
            <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <div className="mt-2 space-y-2">
                            {noteCheckBoxes.length > 0 && (
                                <>
                                    {incompletedTasks.map((checkbox, index) => (
                                        <div key={checkbox.sort_order} className="flex items-center space-x-2 border">
                                            <div className="flex items-center justify-center pl-3">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    onClick={(e) => handleCheckBox(e, checkbox.sort_order)}
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                className="flex-grow px-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
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
                                    ))}
                                    <div className="border">
                                        <input
                                            ref={addNewItemRef}
                                            type="text"
                                            placeholder="List item"
                                            onChange={(e) => handleAddNewItem(e)}
                                            className="w-full text-sm focus:outline-none px-4 py-2"
                                        />
                                    </div>
                                    {completedTasks.length > 0 && (
                                        <>
                                            <hr className="my-4 border-gray-200" />
                                            <div className="mt-2 space-y-2">
                                                <button
                                                    onClick={(e) => handleCompletedTaskSectionCollapse(e)}
                                                    className="flex items-center text-sm font-medium text-gray-900"
                                                >
                                                    {isCompletedTasksCollapsed ? (
                                                        <GoChevronDown />
                                                    )  :
                                                        <GoChevronRight />
                                                    }
                                                    <span className="ml-2">
                                                        {completedTasks.length} completed item(s)
                                                    </span>
                                                </button>

                                                {isCompletedTasksCollapsed && completedTasks.map((completedTask, index) => (
                                                    <div key={completedTask.sort_order} className="flex items-center space-x-2 border">
                                                        <div className="flex items-center justify-center pl-3">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                                onChange={(e) => handleCheckBox(e, completedTask.sort_order)}
                                                                checked={true}
                                                            />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="flex-grow px-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 line-through"
                                                            value={completedTask.item}
                                                            onChange={(e) => handleItemChange(e, completedTask.sort_order)}
                                                            onKeyDown={(e) => handleKeyDown(e, completedTask.sort_order, index)}
                                                            ref={(node) => {
                                                                const map = getMap();
                                                                if (node) {
                                                                    map.set(completedTask.sort_order, node);
                                                                } else {
                                                                    map.delete(completedTask.sort_order);
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                                                            onClick={(e) => handleItemDelete(e, completedTask.sort_order)}
                                                        >
                                                            <RxCross1 size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                </>
                            )}
                        </div>
                        {editNote && (
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 sm:max-w-4xl mx-auto">
                                <textarea
                                    id="message"
                                    className="block p-2.5 w-full h-48 text-sm rounded-lg border border-gray-300"
                                    value={editNote.body}
                                ></textarea>
                            </div>
                        )}
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleNoteSave}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                            >
                                Save
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}