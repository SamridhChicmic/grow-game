// "use client";
// import { pushSearchParams } from "@/lib/utils/helpers";
// import { usePathname, useSearchParams } from "next/navigation";
// import { useRouter } from "next/navigation";

// type Arg = {
//   value: string;
//   title: string | React.ReactNode | React.FC<React.SVGProps<SVGElement>>;
// };

// export default function ParamsNav({
//   args,
//   searchParam,
//   className,
//   itemBuilder,
//   indicatorColor,
// }: {
//   args: Arg[];
//   searchParam: string;
//   className?: string;
//   itemBuilder?({
//     isActive,
//     title,
//     value,
//   }: Arg & { isActive: boolean }): React.ReactNode;
//   indicatorColor?: string;
// }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const pathname = usePathname();

//   const feed = searchParams.get(searchParam);

//   return (
//     <div className={`flex w-fit mx-auto items-center ${className}`}>
//       {args.map(({ value, title }, i) => {
//         const isActive = value === feed;
//         return (
//           <div
//             key={i}
//             onClick={() =>
//               router.push(
//                 `${pathname}?${pushSearchParams(searchParams.toString(), [
//                   {
//                     param: searchParam,
//                     value,
//                   },
//                 ])}`
//               )
//             }
//             className={`nav relative after:!bg-gray-600/60 after:h-[2px] cursor-pointer whitespace-nowrap ${indicatorColor} ${
//               isActive && "nav-active"
//             }`}
//           >
//             {itemBuilder?.({ isActive, title, value }) ||
//               (title as React.ReactNode)}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

export default function ParamsNav() {
  return <></>;
}
