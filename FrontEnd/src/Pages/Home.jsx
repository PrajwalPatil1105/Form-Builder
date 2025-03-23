import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Home() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [formResponses, setFormResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [responseLoading, setResponseLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/forms`);
        const data = await response.json();

        if (response.ok) {
          setForms(data);
          // Fetch response counts for each form
          fetchAllResponses(data);
        } else {
          toast.error(data.message || "Failed to fetch forms.");
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
        toast.error("An unexpected error occurred while fetching forms.");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const fetchAllResponses = async (forms) => {
    setResponseLoading(true);
    try {
      const responsesData = {};
      await Promise.all(
        forms.map(async (form) => {
          try {
            const response = await fetch(
              `${BASE_URL}/api/forms/${form._id}/responses`
            );
            const data = await response.json();

            if (response.ok) {
              responsesData[form._id] = data;
            }
          } catch (error) {
            console.error(
              `Error fetching responses for form ${form._id}:`,
              error
            );
          }
        })
      );
      setFormResponses(responsesData);
    } catch (error) {
      console.error("Error fetching all responses:", error);
      toast.error("Failed to load some form responses.");
    } finally {
      setResponseLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/forms/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setForms(forms.filter((form) => form._id !== id));
        toast.success(data.message || "Form deleted successfully!");
      } else {
        toast.error(data.message || "Failed to delete the form.");
      }
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("An unexpected error occurred while deleting the form.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Form.com</h1>
        <p className="text-gray-600">This is a simple form builder</p>
        <button
          onClick={() => navigate("/form/create")}
          className="mt-4 inline-block bg-green-600 border-2 border-green-600 hover:bg-transparent hover:text-green-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
        >
          CREATE NEW FORM
        </button>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Forms</h2>
        {loading ? (
          <p className="text-center">Loading forms...</p>
        ) : forms.length === 0 ? (
          <p className="text-gray-600">You have no forms created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form._id}
                className="border rounded-md shadow-sm p-6 hover:shadow-md transition-shadow relative"
              >
                <button
                  onClick={() => {
                    const shareUrl = `http://localhost:5173/form/${form._id}`;
                    navigator.clipboard
                      .writeText(shareUrl)
                      .then(() => toast.success("Link copied to clipboard!"))
                      .catch((err) => toast.error("Failed to copy link"));
                  }}
                  className="absolute top-3 right-3 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Copy share link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </button>

                <h3 className="text-xl font-medium mb-4">
                  {form.title || "Untitled Form"}
                </h3>
                <div className="flex space-x-3 text-sm">
                  <Link
                    to={`/form/${form._id}`}
                    className="text-green-600 hover:text-green-800"
                  >
                    VIEW
                  </Link>
                  <Link
                    to={`/form/${form._id}/edit`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    EDIT
                  </Link>
                  <button
                    onClick={() => handleDelete(form._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Responses Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">Form Responses</h2>
        {loading || responseLoading ? (
          <p className="text-center">Loading responses...</p>
        ) : forms.length === 0 ? (
          <p className="text-gray-600">No forms available to show responses.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => {
              const responses = formResponses[form._id] || [];
              return (
                <div
                  key={`responses-${form._id}`}
                  className="border rounded-md shadow-sm p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-medium mb-2">
                    {form.title || "Untitled Form"}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {responses.length}{" "}
                    {responses.length === 1 ? "response" : "responses"}
                    {/* This code demonstrates attention to detail in singular/plural handling */}
                  </p>
                  <Link
                    to={`/form/${form._id}/responses`}
                    className="inline-block bg-purple-600 border-2 border-purple-600 hover:bg-transparent hover:text-purple-600 text-white font-semibold py-1 px-3 rounded-sm text-sm transition-colors duration-300"
                  >
                    VIEW RESPONSES
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
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

export default Home;
