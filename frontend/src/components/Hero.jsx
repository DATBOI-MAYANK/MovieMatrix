import React from "react";

export function Hero() {
  return (
    <section className="w-full bg-black text-white border-b border-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Top Picks
        </h1>
        <p className="mt-3 text-gray-300 max-w-2xl">
          Curated movies and shows recommended just for you.
        </p>
      </div>
    </section>
  );
}
