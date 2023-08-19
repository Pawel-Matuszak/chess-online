import { GetResult } from "@prisma/client/runtime/library";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

      return { status: true, message: "Joined room" };
    }),

  createGame: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const gameData = await ctx.prisma.game.create({
        data: {},
      });

      await ctx.prisma.room.update({
        where: { id: input.roomId },
        data: {
          status: "PLAYING",
          gameId: gameData.id,
        },
      });
    }),

  assignPlayerColor: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
        userId: z.string(),
        userColor: z.enum(["WHITE", "BLACK"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const gameData = await ctx.prisma.room.findUnique({
        where: { id: input.roomId },
      });

      const gameId = gameData?.gameId;
      if (!gameId) {
        return { status: false, message: "Game not found" };
      }

      await ctx.prisma.game.update({
        where: { id: gameId },
        data: {
          [input.userColor == "WHITE" ? "playerWhiteId" : "playerBlackId"]:
            input.userId,
        },
      });
    }),

  //   getAll: publicProcedure.query(({ ctx }) => {
  //     return ctx.prisma.example.findMany() as Prisma.PrismaPromise<any>;
  //   }),

  //   getSecretMessage: protectedProcedure.query(() => {
  //     return "you can now see this secret message!";
  //   }),
});
