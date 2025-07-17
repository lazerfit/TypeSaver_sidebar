import * as React from "react";

export const handleCopyText = (
  e: React.MouseEvent<HTMLButtonElement>,
  text: string,
) => {
  e.stopPropagation();
  navigator.clipboard
    .writeText(text)
    .catch((e) => console.error("Failed to copy text:", e));
};
