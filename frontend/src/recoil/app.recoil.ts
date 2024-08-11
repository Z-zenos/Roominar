import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import type { IAppData } from '@/src/type/app';

const { persistAtom } = recoilPersist();

export const LoadingGlobalState = atom({ key: 'loading-global', default: false });

export const AppDataState = atom<IAppData | undefined>({
  default: undefined,
  key: 'app-data-state',
});
