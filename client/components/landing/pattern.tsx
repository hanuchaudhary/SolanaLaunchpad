import React from "react";

export default function Pattern() {
  return (
    <>
      <div className="absolute top-0 md:-left-10 left-0 w-4 md:w-10 h-full pointer-events-none md:border-l border-r bg-[image:repeating-linear-gradient(315deg,_#0000000d_0,_#0000000d_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed dark:bg-[image:repeating-linear-gradient(315deg,_#ffffff1a_0,_#ffffff0a_1px,_transparent_0,_transparent_50%)] border-b" />
      <div className="absolute top-0 md:-right-10 right-0 w-4 md:w-10 h-full pointer-events-none md:border-r border-l bg-[image:repeating-linear-gradient(315deg,_#0000000d_0,_#0000000d_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed dark:bg-[image:repeating-linear-gradient(315deg,_#ffffff1a_0,_#ffffff0a_1px,_transparent_0,_transparent_50%)] border-b" />
    </>
  );
}
