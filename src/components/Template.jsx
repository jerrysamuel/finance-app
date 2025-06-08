import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";

const templates = [
  { id: 1, src: "/assets/claire.jpg", name: "Template 1" },
  { id: 2, src: "/assets/cybrox.jpg", name: "Template 2" },
  { id: 3, src: "/assets/lj.jpg", name: "Template 3" },
  { id: 4, src: "/assets/potter.jpg", name: "Template 4" },
  { id: 5, src: "/assets/signdaddy.jpg", name: "Template 5" },
  { id: 6, src: "/assets/signderella.jpg", name: "Template 6" },
  { id: 7, src: "/assets/tajudeen.jpg", name: "Template 7" },
  { id: 8, src: "/assets/truth.jpg", name: "Template 8" },
  { id: 9, src: "/assets/zoe.jpg", name: "Template 9" }
];

const SelectTemplate = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleTemplateSelect = (imageSrc) => {
    setSelectedImage(imageSrc);
    localStorage.setItem("selectedTemplate", imageSrc); // Store for game use
    navigate("/start"); // Navigate to game page
  };

  return (
    <>
    <Navbar/>
    <div className="bg-black min-h-screen flex flex-col items-center text-white p-4">
      <h1 className="text-4xl font-extrabold mt-6 text-orange-500">🧩 Select Your Puzzle</h1>
      <p className="text-lg text-gray-300 mb-6">Pick an image to scramble and play!</p>

      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-orange-600 p-3 rounded-lg text-center cursor-pointer transform hover:scale-105 transition-all shadow-lg hover:shadow-orange-500"
            onClick={() => handleTemplateSelect(template.src)}
          >
            <img
              src={template.src}
              alt={template.name}
              className="mx-auto h-24 w-24 mb-2 rounded-lg object-cover"
            />
            <p className="text-white font-semibold">{template.name}</p>
          </div>
        ))}
      </div>

      {selectedImage && (
        <p className="mt-4 text-green-400 text-lg">
          ✅ You selected a template! Click <span className="text-orange-500">Continue</span> to start.
        </p>
      )}
    </div>
    </>
  );
};

export default SelectTemplate;
