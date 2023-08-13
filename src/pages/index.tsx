import axios from "axios";
import { Color } from "chess.js";
import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";
import Board from "~/components/Board/Board";
import GameEndDialog from "~/components/Board/GameEndDialog";
import GameMenu from "~/components/GameMenu/GameMenu";
import HistoryComponent from "~/components/GameMenu/HistoryComponent";
import { useSocketState } from "~/hooks/useSocketState";
import { setGameFen, setGamePgn, setPlayerColor } from "~/state/boardSlice";
import {
  setDrawResponseMessage,
  setGameState,
  setGameStateMessage,
  setGameWinner,
  setIsDrawProposalRecieved,
  setMessage,
  setRoomId,
} from "~/state/globalSlice";
import { useAppDispatch, useAppSelector } from "~/utils/hooks";
import { socket } from "~/utils/socket";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [value, setValue] = useState("");

  const [moves, setMoves] = useState<string[]>([]);
  const { isConnected } = useSocketState();
  const dispatch = useAppDispatch();
  const { roomId, gameState, message } = useAppSelector(
    (state) => state.global
  );

  useEffect(() => {
    const socketInit = async () => {
      await axios.get("/api/socket");
      socket.connect();

      socket.on(
        "created-game",
        ({ status, id }: { status: boolean; id: string }) => {
          if (status) {
            dispatch(setRoomId(id));
            dispatch(setGameState("joined"));
            dispatch(setMessage(""));
          }
        }
      );

      socket.on(
        "joined-game",
        ({
          status,
          message,
          id,
        }: {
          status: boolean;
          message: string;
          id: string;
        }) => {
          //todo send game fen
          dispatch(setGameState("joined"));
          status && dispatch(setRoomId(id));
          dispatch(setMessage(!status ? message : ""));
        }
      );

      socket.on(
        "start-game",
        ({
          status,
          playerColor,
          gameFen,
        }: {
          status: boolean;
          playerColor: Color;
          gameFen: string;
        }) => {
          if (status) {
            dispatch(setGameState("started"));
            dispatch(setGameFen(gameFen));
            dispatch(setGamePgn(""));
            dispatch(setPlayerColor(playerColor));
          }
        }
      );

      socket.on("game-updated", (fen: string, pgn: string) => {
        console.log("game-updated", fen, pgn);
        dispatch(setGameFen(fen));
        dispatch(setGamePgn(pgn));
      });

      socket.on(
        "game-ended",
        ({ winner, message }: { winner: Color | "d"; message: string }) => {
          dispatch(setGameState("ended"));
          dispatch(setGameStateMessage(message));
          dispatch(setGameWinner(winner));
        }
      );

      socket.on("draw-proposed", (message: string) => {
        console.log(message);
        dispatch(setIsDrawProposalRecieved(true));
      });

      socket.on("draw-proposal-decline", (responseMessage: string) => {
        console.log(responseMessage);
        dispatch(setDrawResponseMessage(responseMessage));
      });

      dispatch(setMessage(""));
    };
    socketInit().catch(console.error);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("game-update", (data) => {
      setMoves([...moves, data]);
    });
  }, [moves]);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onSendMessage = (value: string) => {
    socket.emit("game-update", roomId, value);
  };

  const isGameStarted = gameState === "started";

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background-primary to-background-primary font-noto-sans text-white">
        {isConnected !== "loading" && (
          <div className="container flex flex-row flex-wrap items-center justify-center gap-12 px-4 py-16 ">
            <Board />
            <div className="h-full self-start rounded-md bg-background-secondary shadow-md ">
              <GameMenu />
              <HistoryComponent />
            </div>

            <GameEndDialog />

            {/* 
            {isGameStarted && (
             <div>
            </div> */}
          </div>
        )}
      </main>
    </>
  );
}
