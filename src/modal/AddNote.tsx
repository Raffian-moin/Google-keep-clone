import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useEffect, useRef } from 'react';
import { BiSolidArchiveIn } from "react-icons/bi";
import { BsBellFill, BsCheck, BsImageFill, BsPaletteFill, BsPersonPlusFill, BsThreeDotsVertical } from "react-icons/bs";
import { GoChevronDown, GoChevronRight } from 'react-icons/go';
import { RxCross1 } from 'react-icons/rx';
import { useImmer } from 'use-immer';

type Props = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


export default function AddNote({ open, setOpen, setNotes }: Props) {
    const addNewItemRef = useRef(null);
    const noteCheckBoxItemRef = useRef(null);
    const dropdownRef = useRef<null | HTMLDivElement>(null);
    const [activeDropdown, setActiveDropdown] = useImmer<boolean>(false);
    const [isCheckBoxNote, setIsCheckBoxNote] = useImmer<boolean>(false);
    const [noteCheckBoxes, setNoteCheckBoxes] = useImmer([]);
    const [isCompletedTasksCollapsed, SetIsCompletedTasksCollapsed] = useImmer(false);
    const [textAreaValue, SetTextAreaValue] = useImmer('');
    const [currentCheckboxID, SetCurrentCheckboxID] = useImmer(null);

    const handleNoteSave = () => {
        setNotes((draft) => {
            draft.push({
                id: Math.random(),
                title: "Beyond Solar system",
                body: isCheckBoxNote ? noteCheckBoxes : textAreaValue,
                is_checkbox: isCheckBoxNote ? true : false
            });
        });
        setOpen(false)
    }

    let uncompletedTasks = [];
    let completedTasks = [];

    if (noteCheckBoxes.length > 0) {
        uncompletedTasks = (noteCheckBoxes.filter((item) => item.is_checked === false));
        completedTasks = (noteCheckBoxes.filter((item) => item.is_checked === true));
    }

    const toggleDropdown = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        setActiveDropdown(true);
    };

    const handleAddNewItem = (e) => {
        e.stopPropagation();
        const character = e.target.value
        if (character) {
            let sortOrder = 1;

            if (noteCheckBoxes.length > 0) {
                sortOrder = noteCheckBoxes[noteCheckBoxes.length - 1].sort_order + 1;
            }

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

    useEffect(() => {
        const map = getMap();
        const currentInputItem = map.get(currentCheckboxID);
        if (currentInputItem) {
            currentInputItem?.focus();
        }

    }, [currentCheckboxID]);

    const handleKeyDown = (e, checkboxID: number, key: number) => {
        e.stopPropagation();
        // If user hits enter button then add a new input field below
        if (e.key === "Enter") {
            // If user hits enter on incompleted last input field then do not add a new field below
            // because there is already an open input field
            if (uncompletedTasks[uncompletedTasks.length - 1].sort_order === checkboxID) {
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

    const handleShowCheckBox = () => {
        setIsCheckBoxNote((prevState) => !prevState);
        setActiveDropdown((prevState) => !prevState);

        // Here isCheckBoxNote is previous state value
        // So if previous value is false then for this call of the
        // function is true. So !isCheckBoxNote means that it is true as we toggle
        if (!isCheckBoxNote) {
            const splittedTextItems = textAreaValue.split(/\r?\n/);

            const checkboxItems = [];
            splittedTextItems.forEach((splittedTextItem, index) => {
                if (splittedTextItem) {
                    checkboxItems.push({
                        "sort_order": index + 1,
                        "item": splittedTextItem,
                        "is_checked": false
                    });
                }
            });

            setNoteCheckBoxes(checkboxItems);
            SetTextAreaValue('');
        } else {
            // Reverse condition of if condition

            let convertedTextAreaValueFromCheckboxes = ''
            noteCheckBoxes.forEach((noteCheckBox) => {
                convertedTextAreaValueFromCheckboxes += `${noteCheckBox.item}\n`;
            });
            SetTextAreaValue(convertedTextAreaValueFromCheckboxes);
        }

    const handleUncheckAllItems = () => {
        setNoteCheckBoxes((draft) => {
            draft.map((item) => {
                if (item.is_checked === true) {
                    item.is_checked = false;
                }
                return item;
            });
        });

        setActiveDropdown(false);
    }

    const handleDeleteCheckedItems = () => {
        setNoteCheckBoxes((draft) => {
            return draft.filter((item) => item.is_checked === false);
        });

        setActiveDropdown(false)
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

    const NoteIcons = () => (
        <div className="flex justify-between items-center mt-2 text-gray-500">
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
            <IconWrapper onClick={(e: React.SyntheticEvent) => toggleDropdown(e)}>
                <BsThreeDotsVertical className="cursor-pointer hover:text-gray-700" />
            </IconWrapper>
            {activeDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10" ref={dropdownRef}>
                    <div className="py-1">
                        {isCheckBoxNote && completedTasks.length > 0 && (
                            <>
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleUncheckAllItems}>Uncheck all items</button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleDeleteCheckedItems}>Delete checked items</button>
                            </>
                        )}
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleShowCheckBox}>{isCheckBoxNote ? "Hide Checkboxes" : "Show checkboxes"}</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add label</button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add drawing</button>
                    </div>
                </div>
            )}
        </div>
    );

    const handleTextAreaValue = (e) => {
        e.stopPropagation();
        SetTextAreaValue(e.target.value)
    }

    const handleClose = () => {
        if (isCheckBoxNote) {
            setNoteCheckBoxes([]);
            setIsCheckBoxNote(false)
        } else {
            SetTextAreaValue('');
        }

        setOpen(false);
    }

    const IconWrapper = ({ children, onClick }) => (
        <div className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200" onClick={onClick}>
            {children}
        </div>
    );

    return (
        <Dialog open={open} onClose={handleClose} className="relative z-10">
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
                        <div className="mt-2 space-y-2">
                            {isCheckBoxNote && (
                                <>
                                    {uncompletedTasks.map((checkbox, index) => (
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
                                                    ) :
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

                        { !isCheckBoxNote && (
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 sm:max-w-4xl mx-auto">
                                <textarea
                                    id="message"
                                    className="block p-2.5 w-full h-48 text-sm rounded-lg border border-gray-300"
                                    value={textAreaValue}
                                    onChange={(e) => handleTextAreaValue(e)}
                                ></textarea>
                            </div>
                        )}

                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                data-autofocus
                                onClick={handleNoteSave}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Save
                            </button>
                        </div>
                        <NoteIcons />
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
