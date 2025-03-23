import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function FormList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/forms`);
        const data = await response.json();

        if (response.ok) {
          setForms(data);
        } else {
          console.error(
            "Failed to fetch forms:",
            data.message || "Server error"
          );
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/forms/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setForms(forms.filter((form) => form._id !== id));
        } else {
          const data = await response.json();
          console.error(
            "Failed to delete form:",
            data.message || "Server error"
          );
        }
      } catch (error) {
        console.error("Error deleting form:", error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading forms...</div>;
  }

  if (forms.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No forms created yet.</p>
        <Link
          to="/form/create"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Create New Form
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Forms</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div
            key={form._id}
            className="bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{form.title}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {form.inputs.length} input fields
            </p>

            <div className="flex justify-between items-center">
              <div className="space-x-2">
                <Link
                  to={`/form/${form._id}`}
                  className="text-green-500 hover:text-green-700 font-medium transition-colors"
                >
                  VIEW
                </Link>
                <Link
                  to={`/form/${form._id}/edit`}
                  className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                >
                  EDIT
                </Link>
                <button
                  onClick={() => handleDelete(form._id)}
                  className="text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormList;
