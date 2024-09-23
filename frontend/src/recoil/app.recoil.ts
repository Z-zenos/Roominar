import { atom } from 'recoil';

export const LoadingGlobalState = atom({
  key: 'loading-global',
  default: false,
});

export const AppDataState = atom<object | undefined>({
  default: undefined,
  key: 'app-data-state',
});
