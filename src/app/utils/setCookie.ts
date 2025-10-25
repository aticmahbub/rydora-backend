import {Response} from 'express';

export interface IAuthInterface {
    accessToken?: string;
    refreshToken?: string;
}
export const setAuthCookie = (res: Response, tokenInfo: IAuthInterface) => {
    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, {
            httpOnly: true,
            secure: false,
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie('refreshToken', tokenInfo.refreshToken, {
            httpOnly: true,
            secure: false,
        });
    }
};
