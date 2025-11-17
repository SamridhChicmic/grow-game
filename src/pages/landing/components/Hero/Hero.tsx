import { DiscordIcon, InstagramIcon } from "@/assets/svgs";
import { Button } from "@/components";
import { useAppSelector } from "@/hooks/store";
import { useSearchParams } from "react-router-dom";

export default function Hero() {
  const auth = useAppSelector((state) => state.auth);
  const setSearchParams = useSearchParams()[1];

  return (
    <div className="bg-[linear-gradient(to_right,rgb(0,0,0),rgba(0,0,0,0.5)),url('/images/landing/banner.png')] flex-1 min-h-[270px] max-h-[270px] w-full bg-center !bg-cover bg-no-repeat flex flex-col rounded-md">
      <div className="flex flex-col justify-center flex-grow items-start p-10 gap-3">
        <h1 className="text-5xl font-extrabold uppercase">
          {/* GAME <span className="text-primary">GROW</span> */}

          <img src="/logo.png" className="w-72" />
        </h1>
        <span className="font-semibold text-light">
          The first Growtopia web-based gaming platform.
        </span>
        <div className="flex items-center gap-3">
          {auth.isAuthenticated ? (
            <div className="font-bold text-[1.15rem] flex gap-4">
              <a
                href="/discord"
                target="_blank"
                className="uppercase text-white flex gap-1 items-center hover:text-[#5865F2] transition-colors"
              >
                <DiscordIcon />
                Discord
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                className="uppercase text-white flex gap-1 items-center hover:text-[#cc367e] transition-colors"
              >
                <InstagramIcon />
                Instagram
              </a>
            </div>
          ) : (
            <Button onClick={() => setSearchParams({ modal: "register" })}>
              Register Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
