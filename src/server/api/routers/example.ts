import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs, GetResult } from "@prisma/client/runtime/library";
import { Session } from "next-auth";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface Ictx {
  session: Session | null;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}

export const mainRouter = createTRPCRouter({
  createRoom: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return (await ctx.prisma.room.create({
        data: {
          userId: [input.userId],
        },
      })) as GetResult<any, any>;
    }),
  joinRoom: publicProcedure
    .input(z.object({ roomId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.findUnique({
        where: { id: input.roomId },
      });
      if (!room) {
        return { status: false, message: "Room not found" };
      }

      //todo prod uncomment
      // if (room.userId.includes(input.userId)) {
      //   return { status: false, message: "Already joined" };
      // }

      if (room.userId.length >= 2) {
        return { status: false, message: "Room is full" };
      }

      await ctx.prisma.room.update({
        where: { id: input.roomId },
        data: {
          userId: [...room.userId, input.userId],
        },
      });

      if (room.userId.length + 1 == 2) await createGame(ctx, input.roomId);

      return {
        status: true,
        message: "Joined room",
        playerCount: room.userId.length + 1,
      };
    }),

  setPlayerColor: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
        userId: z.string(),
        playerColor: z.enum(["WHITE", "BLACK"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await setPlayerColor(ctx, input.roomId, input.userId, input.playerColor);
    }),

  getPlayers: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.roomId || input.roomId == "") return { status: false };
      const room = await ctx.prisma.room.findUnique({
        where: { id: input.roomId },
      });
      if (!room || room.gameId) {
        return { status: false, message: "Game not found" };
      }

      const game = await ctx.prisma.game.findUnique({
        where: { id: room.gameId },
      });

      const playerWhite = await ctx.prisma.user.findUnique({
        where: { id: game?.playerWhiteId },
      });
      const playerBlack = await ctx.prisma.user.findUnique({
        where: { id: game?.playerBlackId },
      });

      return {
        status: true,
        message: "Got player colors",
        playerWhite: playerWhite,
        playerBlack: playerBlack,
      };
    }),

  //   getAll: publicProcedure.query(({ ctx }) => {
  //     return ctx.prisma.example.findMany() as Prisma.PrismaPromise<any>;
  //   }),

  //   getSecretMessage: protectedProcedure.query(() => {
  //     return "you can now see this secret message!";
  //   }),
});

const createGame = async (ctx: Ictx, roomId: string) => {
  const gameData = await ctx.prisma.game.create({
    data: {},
  });

  await ctx.prisma.room.update({
    where: { id: roomId },
    data: {
      status: "PLAYING",
      gameId: gameData.id,
    },
  });
};

const setPlayerColor = async (
  ctx: Ictx,
  roomId: string,
  userId: string,
  userColor: "WHITE" | "BLACK"
) => {
  const gameData = await ctx.prisma.room.findUnique({
    where: { id: roomId },
  });

  const gameId = gameData?.gameId;
  if (!gameId) {
    return { status: false, message: "Game not found" };
  }

  await ctx.prisma.game.update({
    where: { id: gameId },
    data: {
      [userColor == "WHITE" ? "playerWhiteId" : "playerBlackId"]: userId,
    },
  });
};
