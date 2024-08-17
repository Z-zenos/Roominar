import { atom } from 'recoil';
import type { IAppData } from '@/src/type/app';

export const LoadingGlobalState = atom({ key: 'loading-global', default: false });

export const AppDataState = atom<IAppData | undefined>({
  default: undefined,
  key: 'app-data-state',
});
