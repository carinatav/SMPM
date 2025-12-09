import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || '');

  const login = async (data) => {
    const res = await api.post('/auth/login', data);
    token.value = res.data.token;
    user.value = res.data.user;
    localStorage.setItem('token', token.value);
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  };

  const logout = () => {
    user.value = null;
    token.value = '';
    localStorage.removeItem('token');
  };

  return { user, token, login, register, logout };
});