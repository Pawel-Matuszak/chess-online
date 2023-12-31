import { FaUser } from "react-icons/fa";
import { useAppSelector } from "~/utils/hooks";

export interface GuestIconProps {
  playerData: { name: string };
}

const GuestIcon: React.FC<GuestIconProps> = ({ playerData }) => {
  const { gameState } = useAppSelector((state) => state.global);

  return (
    <div className="absolute top-0 h-10 -translate-y-[100%]">
      {(gameState == "joined" ||
        gameState == "started" ||
        gameState == "ended") && (
        <div className="m-1 flex items-center gap-2 text-xl">
          {gameState == "joined" ? (
            <div role="status" className="animate-pulse">
              <div className=" flex items-center justify-center">
                <svg
                  className="mr-2 h-7 w-7 text-gray-200 dark:text-gray-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
                <div className="mr-3 h-2.5 w-14 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          ) : (
            <>
              {playerData ? (
                <>
                  <img
                    src={playerData.name ?? ""}
                    width={24}
                    height={24}
                    alt="profile-picture"
                  />
                  <h3 className="w- text-lg">{playerData.name}</h3>
                </>
              ) : (
                <>
                  <FaUser /> Guest
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GuestIcon;
