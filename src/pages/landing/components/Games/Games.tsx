import { games } from "@/data/games";
import "./games.css";
import { Link } from "react-router-dom";
import clsx from "clsx";

export default function Games() {
  return (
    <div className="grid grid-flow-row gap-3  grid-cols-gamesGridSm sm:grid-cols-gamesGrid grid-rows-1 flex-1">
      {games.map((game, i) => (
        <Link
          to={game.title === "unboxing" ? "/" : `/games/${game.title}`}
          key={i}
          className={clsx(
            "rounded-md cursor-pointer hover:-translate-y-1 transition-all duration-100 overflow-clip relative",
          )}
        >
          {game.title === "unboxing" && (
            <div
              className={clsx(
                game.title === "unboxing" &&
                  "w-full h-full flex items-center justify-center bg-black/70 absolute",
              )}
            >
              <p className="text-2xl absolute text-white font-bold -rotate-12">
                Coming Soon
              </p>
            </div>
          )}

          {/* <p>{game.i}</p> */}
          <img src={`/images/landing/games/${game.image}`} />
        </Link>
      ))}
    </div>
  );
}
