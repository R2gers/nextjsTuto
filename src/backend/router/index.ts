import playerIds from '@/constants/playerIds';
import * as trpc from '@trpc/server';
import { z } from 'zod';

export const appRouter = trpc.router().query("getPlayers", {

    async resolve() {
        const players = await Promise.all(
            playerIds.map(async (id, i) => {
                const player = await fetch(`https://api.opendota.com/api/players/${id}?api_key=645ea0bb-5c00-4d67-91a0-e60a9b2c1f84`);
                const playerwl = await fetch(`https://api.opendota.com/api/players/${id}/wl?api_key=645ea0bb-5c00-4d67-91a0-e60a9b2c1f84`);
                const playerJson = await player.json();
                const playerwlJson = await playerwl.json();


                playerJson['order'] = i + 1;
                if (playerJson) {

                    console.log(playerJson);
                    return {
                        order: playerJson.order,
                        img: playerJson.profile.avatarfull,
                        id: playerJson.profile.account_id,
                        name: playerJson.profile.personaname,
                        wr: (playerwlJson.win / playerwlJson.lose).toFixed(2)

                    };
                }
            }));

        return {
            players
        };
    },
});

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
