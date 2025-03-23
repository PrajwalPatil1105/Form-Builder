import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function FormResponses() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState([]);
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const fetchFormAndResponses = async () => {
      setLoading(true);
      try {
        const formResponse = await fetch(`${BASE_URL}/api/forms/${id}`);
        const formData = await formResponse.json();

        if (!formResponse.ok) {
          toast.error(formData.message || "Failed to fetch form details");
          setLoading(false);
          return;
        }

        setForm(formData);
        setInputs(formData.inputs || []);

        const responsesResponse = await fetch(
          `${BASE_URL}/api/forms/${id}/responses`
        );
        const responsesData = await responsesResponse.json();

        if (responsesResponse.ok) {
          setResponses(responsesData);
        } else {
          toast.error(responsesData.message || "Failed to fetch responses");
        }
      } catch (error) {
        console.error("Error fetching form and responses:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFormAndResponses();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-64 bg-gray-200 rounded w-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/home"
          className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2">
          {form?.title || "Untitled Form"} Responses
        </h1>
        <p className="text-gray-600">
          {responses.length} {responses.length === 1 ? "response" : "responses"}{" "}
          submitted
        </p>
      </div>

      {responses.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-700">
            No responses have been submitted for this form yet.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop View - Table format */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
              <thead className="bg-gray-100">
                <tr>
                  {inputs.map((input) => (
                    <th
                      key={input._id}
                      className="py-3 px-4 text-left font-semibold text-gray-700"
                    >
                      {input.title || "Untitled Field"}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {responses.map((response, index) => (
                  <tr
                    key={response._id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {inputs.map((input) => (
                      <td key={input._id} className="py-3 px-4">
                        {response.responses[input._id]?.value || "-"}
                      </td>
                    ))}
                    <td className="py-3 px-4">
                      {new Date(response.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View - Card format */}
          <div className="md:hidden space-y-4">
            {responses.map((response) => (
              <div
                key={response._id}
                className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
              >
                <div className="bg-gray-50 py-2 px-4 border-b">
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(response.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  {inputs.map((input) => (
                    <div key={input._id}>
                      <p className="font-medium text-gray-700">
                        {input.title || "Untitled Field"}
                      </p>
                      <p className="text-gray-800">
                        {response.responses[input._id]?.value || "-"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
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

export default FormResponses;
