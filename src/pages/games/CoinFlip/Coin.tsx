import { Tails } from "@/assets/icons";
import "./coinflip.css";

export default function Coin({
  coinRef,
}: {
  coinRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className={"coin"} ref={coinRef}>
      <img
        src={Tails}
        alt="Heads"
        className=""
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
