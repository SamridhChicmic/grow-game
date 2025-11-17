import api from '@/api/axios';
import { useAppDispatch, useAppSelector } from './store';
import { setUser } from '@/store/slices/auth';
import { AxiosResponse } from 'axios';

export default function useRefreshToken() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const refresh = async () => {
    const response: AxiosResponse<{ token: string }> = await api.get(
      '/auth/refresh-token',
      {
        withCredentials: true,
      },
    );

    dispatch(setUser({ ...auth, token: response.data.token }));

    return response.data.token;
  };

  return refresh;
}
