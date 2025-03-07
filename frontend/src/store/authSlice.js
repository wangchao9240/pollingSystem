import { createSlice } from '@reduxjs/toolkit';
import utils from '../utils/index'

const initialState = {
  user: utils.getCookie('user') ? { ...JSON.parse(utils.getCookie('user')) } : null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      utils.setCookie('user', JSON.stringify(action.payload), 7);
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      utils.deleteCookie('user');
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

export const { setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;