import {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync';
import {sendResponse} from '../../utils/sendResponse';
import {AuthService} from './auth.service';
import AppError from '../../errorHelpers/AppError';
import {setAuthCookie} from '../../utils/setCookie';

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
    const loginInfo = await AuthService.credentialsLogin(req.body);

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User logged in successfully',
        data: loginInfo,
    });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(401, 'No refresh token received from cookies');
    }
    const tokenInfo = await AuthService.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Access token fetched successfully',
        data: tokenInfo,
    });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    // const accessToken = req.headers.cookie;

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User logged out successfully',
        data: null,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    await AuthService.resetPassword(oldPassword, newPassword, decodedToken);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Password is changed successfully',
        data: null,
    });
});

export const AuthController = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
};
