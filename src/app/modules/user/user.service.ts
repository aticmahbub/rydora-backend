import {IUser} from './user.interface';
import {User} from './user.model';

const createUser = async (payload: Partial<IUser>) => {
    const {name, email, password, phone, NID} = payload;
    const user = await User.insertOne({name, email, password, phone, NID});

    return user;
};

const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();

    return {data: users, meta: {total: totalUsers}};
};

export const UserService = {createUser, getAllUsers};
