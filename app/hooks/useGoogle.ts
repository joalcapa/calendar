"use client";

import { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import useApi from "../hooks/useApi";
import { sync } from '../services/google';

const useGoogle = () => {
    const { data: session } = useSession();
    const { fetch } = useApi();

    useEffect(() => {
        let isSync = true;

        if (session && isSync) {
            (async () => {
                try {
                    await fetch(sync(session.accessToken));
                } catch { }
            })();
        }

        return () => {
            isSync = false;
        }
    }, [ session ]);

    return {
        signIn,
        signOut,
        user: session,
        isSession: !!( session || {} )["user"],
    }
};

export default useGoogle;