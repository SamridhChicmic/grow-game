import SilverLockIcon from "@/assets/icons/silver-lock.webp";
import { Link } from "react-router-dom";

export default function MyBets() {
  return (
    <>
      <thead className="uppercase text-gray-500 text-[0.85rem]">
        <tr>
          <th className="bg-dark-850 rounded-l-md py-3 pl-3 text-left w-[1/2]">
            Game
          </th>
          <th className="py-2 text-left bg-dark-850">Player</th>
          <th className="py-2 text-center bg-dark-850">Bet</th>
          <th className="py-2 text-center bg-dark-850">Profit</th>
          <th className="w-2/12 py-2 text-center bg-dark-850">Multiplier</th>
          <th className="py-2 pr-3 text-right rounded-r-sm bg-dark-850">
            Time
          </th>
        </tr>
      </thead>
      <tbody className="border-spacing-y-3">
        {[1, 1, 1, 1].map((_, i) => {
          return (
            <tr
              key={i}
              className="overflow-hidden text-sm bg-dark-850 text-light"
            >
              <td className="rounded-l-sm py-3 text-left pl-3 min-w-[110px]">
                Slots
              </td>
              <td className="text-left text-white overflow-hidden min-w-[130px]">
                <Link to={"/"} className="text-white cursor-pointer">
                  Iamthetopg
                </Link>
              </td>
              <td className="text-center  min-w-[80px]">
                <span className="flex items-center justify-center gap-1">
                  0.40
                  <img
                    src={SilverLockIcon}
                    width="18"
                    height="18"
                    className="sc-x7t9ms-0 dnLnNz"
                  />
                </span>
              </td>
              <td className="text-center min-w-[80px]">
                <span className="flex items-center justify-center gap-1">
                  -0.40
                  <img
                    src={SilverLockIcon}
                    width="18"
                    height="18"
                    className="sc-x7t9ms-0 dnLnNz"
                  />
                </span>
              </td>
              <td className="text-center min-w-[80px]">0.00×</td>
              <td className="pr-3 rounded-r-sm min-w-[90px] text-right">
                12:07:03
              </td>
            </tr>
          );
        })}
      </tbody>
    </>
  );
}
