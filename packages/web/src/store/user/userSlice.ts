import { login, userList } from '@/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface IUser {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  token?: string;
  position?: string;
}

export interface IUserState {
  id?: string;
  username?: string;
  token?: string;
  avatar?: string;
  users?: IUser[];
  bio?: string;
}

export const TOKEN_KEY = 'td_token'
export const USER_KEY = 'td_user'
export const USER_ID_KEY = 'td_user_id'
export const USER_AVA_KEY = 'td_user_avatar'

const initialState: IUserState = {
  id: localStorage.getItem(USER_ID_KEY) || undefined,
  username: localStorage.getItem(USER_KEY) || undefined,
  token: localStorage.getItem(TOKEN_KEY) || undefined,
  avatar: localStorage.getItem(USER_AVA_KEY) || undefined,
  users: undefined
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      const {id, username, token, avatar } = action.payload;
      state.username = username;
      localStorage.setItem(USER_KEY, username);
      state.id = id;
      localStorage.setItem(USER_ID_KEY, id);
      state.token = token;
      localStorage.setItem(TOKEN_KEY, token || '');
      state.avatar = avatar;
      localStorage.setItem(USER_AVA_KEY, avatar || '');
    },
    clearUser: (state) => {
      localStorage.removeItem(USER_ID_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_AVA_KEY)
      state = {
        id: undefined,
        username:  undefined,
        token: undefined,
        avatar: '',
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(thunkLogin.fulfilled, (state, action) => {
        const {id, username, token, avatar } = action.payload;
        state.username = username;
        localStorage.setItem(USER_KEY, username);
        state.id = id;
        localStorage.setItem(USER_ID_KEY, id);
        state.token = token;
        localStorage.setItem(TOKEN_KEY, token || '');
        state.avatar = avatar;
        localStorage.setItem(USER_AVA_KEY, avatar || '');
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.users = action.payload
      })
  }
})

// login
export const thunkLogin = createAsyncThunk('user/login', async (payload: {username: string, password: string}) => {
  return await login(payload.username, payload.password)
})

export const fetchUserList = createAsyncThunk('user/fetchUserList', async() => {
  return await userList()
})

export const userSelector = (state: RootState) => state.user
export const usersSelector = (state: RootState) => state.user.users

export default userSlice.reducer