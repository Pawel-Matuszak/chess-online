import { useSession } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import { useAppSelector } from "~/utils/hooks";

const PlayerIcon = () => {
  const { gameState } = useAppSelector((state) => state.global);
  const { data: session } = useSession();

  return (
    <div className="m-1 h-8">
      {(gameState == "joined" ||
        gameState == "started" ||
        gameState == "ended") && (
        <div className=" flex items-center gap-2 text-xl">
          {session ? (
            <>
              <img
                src={session.user.image ?? ""}
                width={24}
                height={24}
                alt="profile-picture"
              />
              <h3 className="w- text-lg">{session.user.name}</h3>
            </>
          ) : (
            <>
              <FaUser /> You
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerIcon;
