import type { IRouter } from '@/src/type/app';

const createRouters = <T extends Record<string, IRouter>>(routers: T) => routers;

const routers = createRouters({
  notFound: {
    router: '/not-found',
    pattern: '/not-found',
    private: false,
  },
  home: {
    router: '/home',
    pattern: '/home',
    private: false,
  },
  login: {
    router: '/login',
    pattern: '/login',
    private: false,
  },
  register: {
    router: '/register',
    pattern: '/register',
    private: false,
  },
  events: {
    router: (slug: string) => `/events/${slug}`,
    pattern: '/events/:id',
    private: false,
  },
  search: {
    router: '/search',
    pattern: '/search',
    private: false,
  },
});

export default routers;
