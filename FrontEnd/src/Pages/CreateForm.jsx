import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import FormInput from "../Components/FormInput";

function CreateForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Untitled Form");
  const [inputs, setInputs] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInputTypes, setShowInputTypes] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  const [newInput, setNewInput] = useState({
    title: "",
    placeholder: "",
    type: "text",
  });
  const [dragItem, setDragItem] = useState(null);
  const [editingInput, setEditingInput] = useState(null);
  const titleInputRef = useRef(null);

  const handleDragStart = (index) => {
    setDragItem(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex) => {
    if (dragItem === null) return;
    const newInputs = [...inputs];
    const draggedItem = newInputs[dragItem];
    newInputs.splice(dragItem, 1);
    newInputs.splice(dropIndex, 0, draggedItem);

    setInputs(newInputs);
    setDragItem(null);
  };
  const openInputModal = (type) => {
    setSelectedType(type);
    setNewInput({
      title: "",
      placeholder: "",
      type,
    });
    setShowModal(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInput({
      ...newInput,
      [name]: value,
    });
  };

  const handleAddInput = () => {
    if (inputs.length >= 20) {
      alert("Maximum of 20 inputs allowed");
      return;
    }
    if (editingInput !== null) {
      const updatedInputs = inputs.map((input, index) =>
        index === editingInput ? { ...newInput, id: input.id } : input
      );
      setInputs(updatedInputs);
      setEditingInput(null);
    } else {
      setInputs([...inputs, { ...newInput, id: Date.now() }]);
    }

    setShowModal(false);
    setNewInput({
      title: "",
      placeholder: "",
      type: "text",
    });
  };

  const handleEditInput = (index) => {
    setNewInput({ ...inputs[index] });
    setEditingInput(index);
    setShowModal(true);
  };
  const handleDeleteInput = (index) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };
  const handleSaveForm = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/forms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, inputs }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Form saved successfully!");
        navigate("/home");
      } else {
        if (data.code === 3) {
          toast.error(
            data.message ||
              "Form with this title already exists. Please use a different title."
          );
        } else {
          toast.error(data.message || "Failed to save the form.");
        }
      }
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const toggleEditTitle = () => {
    setIsEditingTitle(!isEditingTitle);
    if (!isEditingTitle) {
      setTimeout(() => {
        titleInputRef.current?.focus();
        titleInputRef.current?.select();
      }, 100);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditingTitle(false);
    }
  };

  const toggleInputTypes = () => {
    setShowInputTypes(!showInputTypes);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
        Form Builder
      </h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:min-h-[450px]">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <div className="mb-6 flex items-center justify-between bg-blue-50 p-4 rounded-lg">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                onBlur={() => setIsEditingTitle(false)}
                className="w-full p-2 text-xl font-medium border-b-2 border-blue-500 focus:outline-none bg-blue-50"
                placeholder="Form Title"
              />
            ) : (
              <h2 className="text-xl font-medium text-gray-800">{title}</h2>
            )}
            <button
              onClick={toggleEditTitle}
              className="ml-2 text-blue-600 hover:text-blue-800 transition-colors p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path
                  fillRule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inputs.map((input, index) => (
              <div
                key={input.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className="cursor-move border-2 border-dashed border-gray-200 p-2 rounded-lg hover:border-blue-300 transition-colors"
              >
                <FormInput
                  input={input}
                  onDelete={() => handleDeleteInput(index)}
                  onEdit={() => handleEditInput(index)}
                  readOnly={true}
                />
              </div>
            ))}
          </div>

          {inputs.length === 0 && (
            <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg my-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                fill="currentColor"
                className="mx-auto mb-4 text-gray-400"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <p className="text-sm">
                Add input fields to your form using the panel on the right
              </p>
              <p className="text-xs mt-2">
                Drag and drop the fields to change the position
              </p>
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button
              className="bg-green-600 border-2 mt-22 border-green-600 hover:bg-transparent hover:text-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 flex items-center"
              onClick={handleSaveForm}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 16 16"
              >
                <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
              </svg>
              SAVE FORM
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 md:h-[480px] md:overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">
            Form Editor
          </h2>

          <div className="mb-6">
            <button
              onClick={toggleInputTypes}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              ADD INPUT
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="ml-2"
                viewBox="0 0 16 16"
                style={{
                  transform: showInputTypes ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}
              >
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
              </svg>
            </button>
          </div>

          {showInputTypes && (
            <div className="space-y-1 bg-blue-50 p-4 rounded-lg mb-4 animate-fadeIn">
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Select Input Type
              </h3>
              {["text", "number", "email", "password", "date"].map((type) => (
                <button
                  key={type}
                  onClick={() => openInputModal(type)}
                  className="block w-full bg-white hover:bg-blue-100 text-blue-800 py-2 px-4 rounded-md border border-blue-200 capitalize transition-colors duration-300 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="mr-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1z" />
                  </svg>
                  {type}
                </button>
              ))}
            </div>
          )}

          {!showInputTypes && (
            <div className="mt-8 border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600">
                <h3 className="font-medium text-gray-700 mb-2">Tips</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Click the edit icon to modify fields</li>
                  <li>Click the form title to edit it</li>
                  <li>Drag and drop to adjust sequence of fields</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              {editingInput !== null ? "Edit Input" : "Add New Input"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Input Type
                </label>
                <select
                  name="type"
                  value={newInput.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="password">Password</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={newInput.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Input title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  name="placeholder"
                  value={newInput.placeholder}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Input placeholder"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newInput.title.trim()) {
                    alert("The title field is required.");
                    return;
                  }
                  handleAddInput();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {editingInput !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster
        toastOptions={{
          style: {
            color: "white",
            backgroundColor: "rgb(172, 167, 167)",
            fontFamily: "Poppins",
            fontSize: "0.95em",
            fontWeight: "400",
            marginLeft: "3.5em",
          },
        }}
      />
    </div>
  );
}

export default CreateForm;
