import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DragDropProvider } from "./components/DragDropContext";
import Home from "./Pages/Home";
import CreateForm from "./Pages/CreateForm";
import EditForm from "./Pages/EditForm";
import ViewForm from "./Pages/ViewForm";
import FormResponses from "./Pages/FormResponses";
import Landing from "./Pages/Landing";

function App() {
  return (
    <Router>
      <DragDropProvider>
        <div className="min-h-screen bg-gray-100 font-poppins">
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/form/create" element={<CreateForm />} />
              <Route path="/form/:id/edit" element={<EditForm />} />
              <Route path="/form/:id" element={<ViewForm />} />
              <Route path="/form/:id/responses" element={<FormResponses />} />
              <Route path="/" element={<Landing />} />
            </Routes>
          </div>
        </div>
      </DragDropProvider>
    </Router>
  );
}

export default App;
