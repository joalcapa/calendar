import endpoints from "../../../app/config/endpoints";

export const sync = (token: string) => ({
    ...endpoints.sync,
    data: { token },
});