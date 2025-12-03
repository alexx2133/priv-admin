import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

import "quill/dist/quill.snow.css";
function HtmlViewer({ html }: { html: string }) {
  const [sanitized, setSanitized] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && html) {
      const clean = DOMPurify.sanitize(html);
      setSanitized(clean);
    }
  }, [html]);
  return (
    <div
      className="ql-editor"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

export default HtmlViewer;
