import React, { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import JoditEditor from "jodit-react";

const ImageTextExtractor = () => {
  const [image, setImage] = useState(null);
  const [textBoxes, setTextBoxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const editableRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const extractTextWithPositions = () => {
    if (!image) return;
    setLoading(true);
    setTextBoxes([]);

    Tesseract.recognize(image, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data }) => {
        if (data && data.words) {
          console.log("Extracted words with positions:", data.words);
          setTextBoxes(data.words);
        } else {
          setTextBoxes([]);
        }
        setEditorContent(data.text || "No text found");
      })
      .catch((error) => {
        console.error("OCR Error:", error);
        setTextBoxes([]);
        setEditorContent("Error extracting text");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4 relative">
      <h2 className="text-xl font-bold">Image to Text Extractor</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="block w-full text-sm text-gray-500"
      />

      <div className="relative">
        {image && (
          <img
            src={image}
            alt="Uploaded"
            className="w-full h-auto rounded-md relative"
          />
        )}

        {image &&
          textBoxes &&
          textBoxes.length > 0 &&
          textBoxes.map(
            (word, index) =>
              word.bbox && (
                <div
                  key={index}
                  className="absolute bg-yellow-200 text-black font-bold p-1 rounded"
                  style={{
                    top: `${word.bbox.y0}px`,
                    left: `${word.bbox.x0}px`,
                    width: `${word.bbox.x1 - word.bbox.x0}px`,
                    height: `${word.bbox.y1 - word.bbox.y0}px`,
                  }}
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                >
                  {word.text}
                </div>
              )
          )}
      </div>

      <button
        onClick={extractTextWithPositions}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        disabled={!image || loading}
      >
        {loading ? "Extracting..." : "Extract Text"}
      </button>

      {editorContent && (
        <div className="p-3 bg-gray-100 rounded-md border">
          <h3 className="font-semibold">Extracted Text:</h3>
          <JoditEditor
            value={editorContent}
            onChange={(content) => setEditorContent(content)}
          />
        </div>
      )}
    </div>
  );
};

export default ImageTextExtractor;
