import { useRecoilState } from 'recoil';
import { LoadingGlobalState } from '@/src/recoil/app.recoil';

export default function useLoading() {
  return useRecoilState(LoadingGlobalState);
}
