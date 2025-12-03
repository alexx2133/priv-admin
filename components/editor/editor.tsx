import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import BlotFormatter from "quill-blot-formatter";
import "quill/dist/quill.snow.css";

const Editor = ({ text, setText }: { text: string; setText: Function }) => {
  const { quill, quillRef, Quill } = useQuill({
    modules: { blotFormatter: {} },
  });
  const [firstLoad, setFirstLoad] = useState(true);
  useEffect(() => {
    console.log(quill, text, firstLoad);
    console.log(text);
    if (quill && text !== undefined && firstLoad) {
      console.log("1");
      quill.clipboard.dangerouslyPasteHTML(text);
      setFirstLoad(false);
    }
  }, [quill, text]);
  useEffect(() => {
    if (quill && text !== undefined && firstLoad) {
      console.log("2");
      quill.clipboard.dangerouslyPasteHTML(text);
    }
  }, []);
  if (Quill && !quill) {
    // const BlotFormatter = require('quill-blot-formatter');
    Quill.register("modules/blotFormatter", BlotFormatter);
  }

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setText(quill.root.innerHTML);
      });
    }
  }, [quill]);
  const handleTextChange = (e: any) => {
    console.log(e);
  };
  return (
    <div>
      <div ref={quillRef} onChange={handleTextChange} />
    </div>
  );
};

export default Editor;
