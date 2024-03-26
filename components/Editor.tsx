"use client";

// Editor component
import { useEffect, useState } from "react";

const Editor = ({ resetTrigger, onChange }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(""); // Reset content when the resetTrigger changes
  }, [resetTrigger]);

  const handleChange = (event) => {
    setContent(event.target.value);
    onChange(event.target.value); // Lift state up to parent
  };

  return <textarea value={content} onChange={handleChange} />;
};

export default Editor;
