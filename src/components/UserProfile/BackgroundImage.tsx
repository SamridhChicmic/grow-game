import { useAppSelector } from "@/hooks/store";
import clsx from "clsx";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  variant?: "profile" | "edit";
}

export default function BackgroundImage({
  variant = "profile",
  children,
  ...divProps
}: PropsWithChildren<Props>) {
  const auth = useAppSelector((state) => state.auth);

  console.log("BACKGROUND: ", auth.user);

  return variant === "edit" ? (
    <div
      className={clsx(`sc-134abzr-0 edit-modal-bg`, divProps.className)}
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(
${auth.user?.background || "/images/characters/backgrounds/sunny.webp"},
        )`,
      }}
      {...divProps}
    >
      {children}
    </div>
  ) : (
    <div
      className={clsx(
        "flex flex-col mt-2 rounded-md sm:flex-row sm:items-end overflow-clip __user-bg__ sm:h-40",
        divProps.className,
      )}
      style={{
        backgroundImage: `linear-gradient(#e7bfbfa6, rgba(0,0,0,0.65)), url(
${auth.user?.background || "/images/characters/backgrounds/sunny.webp"})`,
      }}
      {...divProps}
    >
      {children}
    </div>
  );
}
