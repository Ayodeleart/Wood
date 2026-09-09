"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProfileAvatar({ src, name, size = 56 }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-shop-bg text-xl font-medium">
        {name?.[0]?.toUpperCase() || "?"}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name || "Profile photo"}
      fill
      sizes={`${size}px`}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}
