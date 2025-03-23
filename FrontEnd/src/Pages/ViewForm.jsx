import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ViewForm() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/forms/${id}`);
        const data = await response.json();
        if (response.ok) {
          setForm(data);
          const initialData = {};
          data.inputs.forEach((input) => {
            initialData[input._id] = "";
          });
          setFormData(initialData);
        } else {
          console.error(
            "Failed to fetch form:",
            data.message || "Server error"
          );
        }
      } catch (error) {
        console.error("Error fetching form:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const handleInputChange = (e, inputId) => {
    setFormData({
      ...formData,
      [inputId]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/forms/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });
      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        console.error("Failed to submit form:", data.message || "Server error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading form...</div>;
  }

  if (!form) {
    return <div className="text-center py-12">Form not found</div>;
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white p-8 rounded-md shadow-md text-center">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <h2 className="text-2xl font-bold mt-4 mb-2">Form Submitted!</h2>
          <p className="text-gray-600 mb-6">Thank you for your submission.</p>
          <a
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  const renderInput = (input) => {
    switch (input.type) {
      case "text":
        return (
          <input
            type="text"
            id={input._id}
            value={formData[input._id]}
            onChange={(e) => handleInputChange(e, input._id)}
            placeholder={input.placeholder}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        );
      case "email":
        return (
          <input
            type="email"
            id={input._id}
            value={formData[input._id]}
            onChange={(e) => handleInputChange(e, input._id)}
            placeholder={input.placeholder}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        );
      case "password":
        return (
          <input
            type="password"
            id={input._id}
            value={formData[input._id]}
            onChange={(e) => handleInputChange(e, input._id)}
            placeholder={input.placeholder}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        );
      case "number":
        return (
          <input
            type="number"
            id={input._id}
            value={formData[input._id]}
            onChange={(e) => handleInputChange(e, input._id)}
            placeholder={input.placeholder}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        );
      case "date":
        return (
          <input
            type="date"
            id={input._id}
            value={formData[input._id]}
            onChange={(e) => handleInputChange(e, input._id)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        );
      default:
        return (
          <input
            type="text"
            id={input._id}
            value={formData[input._id]}
            onChange={(e) => handleInputChange(e, input._id)}
            placeholder={input.placeholder}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">{form.title}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {form.inputs.map((input) => (
              <div key={input._id} className="mb-4">
                <label
                  htmlFor={input._id}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {input.title}
                </label>
                {renderInput(input)}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 transform hover:scale-105"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ViewForm;
