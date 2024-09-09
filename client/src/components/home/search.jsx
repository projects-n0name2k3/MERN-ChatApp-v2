import { Search } from "lucide-react";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";

function HomeSearch({ value, setValue }) {
  const inputRef = useRef(null);

  return (
    <div
      className="flex items-center bg-accent px-3 rounded dark:border md:hidden lg:flex"
      onClick={() => {
        if (inputRef.current) inputRef.current.focus();
      }}
    >
      <Search className="hover:bg-transparent" size={20} />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={inputRef}
        placeholder="Search"
        className="bg-transparent border-none focus-visible:ring-offset-0 focus-visible:ring-0"
      />
    </div>
  );
}

export default HomeSearch;
