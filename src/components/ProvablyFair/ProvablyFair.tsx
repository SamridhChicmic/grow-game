import { GearIcon, ShieldIcon } from "@/assets/svgs";
import React from "react";

export default function ProvablyFair() {
  return (
    <div className="flex gap-3 items-center capitalize w-[98%] mx-auto">
      <div className="flex items-center gap-1 group">
        <ShieldIcon className="!stroke-gray-500 !fill-gray-500 group-hover:!fill-white group-hover:!stoke-white" />
        <p className="font-semibold text-gray-500 group-hover:text-white">
          provably fair
        </p>
      </div>
      <div className="flex items-center gap-1 group">
        <GearIcon className="!stroke-gray-500 !fill-gray-500 group-hover:!fill-white group-hover:!stoke-white" />
        <p className="font-semibold text-gray-500 group-hover:text-white">
          settings
        </p>
      </div>
    </div>
  );
}
