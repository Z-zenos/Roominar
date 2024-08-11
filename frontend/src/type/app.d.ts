import type { MutableSnapshot } from 'recoil';
import type { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import type routers from '@/src/constant/router.constant';
import type { UserType } from './enum/app.enum';

export type InitializeStateRecoilType = (params: MutableSnapshot) => void;

export interface IAppData {}

export type RoutersType = keyof typeof routers;

export interface IRouter {
  pattern: string;
  private?: boolean;
  redirectUrl?: string;
  router: string | ((...params) => string);
  handler?: (props: { req: NextRequest; res: NextResponse; event?: NextFetchEvent }) => NextResponse | void;
  role?: UserType[];
}

export type EmptyFunc = (...params) => void;

export type GetRouterFunc = (...params) => string;
