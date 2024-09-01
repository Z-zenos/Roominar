import type { MutableSnapshot } from 'recoil';
import type { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import type routers from '@/src/constant/router.constant';

export type InitializeStateRecoilType = (params: MutableSnapshot) => void;

export interface IAppData {}

export type RoutersType = keyof typeof routers;

export interface IRouter {
  pattern: string;
  private?: boolean;
  redirectUrl?: string;
  router: string | ((...params) => string);
  handler?: (props: {
    req: NextRequest;
    res: NextResponse;
    event?: NextFetchEvent;
  }) => NextResponse | void;
  role?: string[];
}

export type EmptyFunc = (...params) => void;

export type GetRouterFunc = (...params) => string;
