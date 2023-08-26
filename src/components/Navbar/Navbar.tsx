import { signIn, signOut, useSession } from "next-auth/react";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import IconButton from "../Common/IconButton";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="flex w-5/6 max-w-6xl items-center justify-between gap-4 py-2">
      <h1 className="text-4xl font-bold">Chess Online</h1>
      <div className="flex items-center gap-4 rounded-md bg-background-secondary p-2 px-4">
        {session ? (
          <>
            <img
              src={session.user.image ?? ""}
              width={32}
              height={32}
              alt="profile-picture"
            />
            <h3 className="text-xl font-bold max-sm:hidden">
              {session.user.name}
            </h3>
            <IconButton
              tooltip="Logout"
              onClick={() => signOut()}
              className="text-xl"
            >
              <FiLogOut />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              tooltip="Login"
              onClick={() => signIn()}
              className="gap-4 text-xl"
            >
              <h3 className="text-xl font-bold">Login</h3>
              <FiLogIn />
            </IconButton>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
