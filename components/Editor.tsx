"use client";
import { useState } from "react";

const Editor = () => {
  const [content, setContent] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  return <textarea value={content} onChange={handleChange} />;
};

export default Editor;
