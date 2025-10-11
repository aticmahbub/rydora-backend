import {IUser} from './user.interface';
import {User} from './user.model';

const createUser = async (payload: Partial<IUser>) => {
    const {name, email, password, phone, NID} = payload;
    const user = await User.insertOne({name, email, password, phone, NID});
    return user;
};

export const UserService = {createUser};
