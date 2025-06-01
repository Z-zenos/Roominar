if (!self.define) {
  let e,
    i = {};
  const s = (s, a) => (
    (s = new URL(s + '.js', a).href),
    i[s] ||
      new Promise((i) => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = s), (e.onload = i), document.head.appendChild(e);
        } else (e = s), importScripts(s), i();
      }).then(() => {
        let e = i[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, c) => {
    const n =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (i[n]) return;
    let t = {};
    const r = (e) => s(e, n),
      u = { module: { uri: n }, exports: t, require: r };
    i[n] = Promise.all(a.map((e) => u[e] || r(e))).then((e) => (c(...e), t));
  };
}
define(['./workbox-e9849328'], function (e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/app-build-manifest.json',
          revision: '24d0cc566ce25048ba0a4af9bbd943d0',
        },
        {
          url: '/_next/static/HAOG2uy3FPz-uoeXHE-gi/_buildManifest.js',
          revision: 'c3669420d83b7217c6ca28b66681d2b1',
        },
        {
          url: '/_next/static/HAOG2uy3FPz-uoeXHE-gi/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/chunks/1050-4c3cc6884bb79c81.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/1138.d6d2ef15481ac650.js',
          revision: 'd6d2ef15481ac650',
        },
        {
          url: '/_next/static/chunks/1247-dff10cd71443f648.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/12514cef-a797efd5ddcf4a54.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/1263-0c5109a454d56218.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/1418-3eb3184f155a30e4.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/1423-764e934449c06e61.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/1488-00480e322306396e.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/1514.f13af4a30d952207.js',
          revision: 'f13af4a30d952207',
        },
        {
          url: '/_next/static/chunks/1550-032dd9afe5d25906.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/1720-38444ba0d39f87fc.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/1817.307dc881a16fe50d.js',
          revision: '307dc881a16fe50d',
        },
        {
          url: '/_next/static/chunks/19d076a6-1f3b977893722e5c.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/1b7bc3a5-98aea5607bb4c02e.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/1e6d99fd.cd0bee66f87552f2.js',
          revision: 'cd0bee66f87552f2',
        },
        {
          url: '/_next/static/chunks/1f12fe1d.5f2dc7f569db52f8.js',
          revision: '5f2dc7f569db52f8',
        },
        {
          url: '/_next/static/chunks/2118-24c7bb4fefe062d8.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/2246-9a49131a46a4dc3b.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/2407-f68f93d7e35ab3a2.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/2531-81fac3437f2cb2ea.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/283.88878cada48e50bf.js',
          revision: '88878cada48e50bf',
        },
        {
          url: '/_next/static/chunks/2942-3b2f84bdf302dd84.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/3006-77a064c8e73b2c09.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/3087-d742ab0d8c9c3e13.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/3144-0524081a4880ada4.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/3165-f3fead365916d718.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/3245-7fc2c767b2902cb1.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/336-1e9d499ee893d63d.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/3424-0967c0feb309eb00.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/3458.6053586634c90bda.js',
          revision: '6053586634c90bda',
        },
        {
          url: '/_next/static/chunks/3847-14e4590ae42df044.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/3919.e5bf5f408411f80a.js',
          revision: 'e5bf5f408411f80a',
        },
        {
          url: '/_next/static/chunks/39a02dcd-637832d7b11f7fea.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/3bae53bb.d995c941992f467e.js',
          revision: 'd995c941992f467e',
        },
        {
          url: '/_next/static/chunks/4015ab43-66f1c139da33e30f.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/4315-207b13ea4e6c6dc7.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/43abe07a-7ca4d85a5d3b5ea9.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/4583.2e3f124ae77dd810.js',
          revision: '2e3f124ae77dd810',
        },
        {
          url: '/_next/static/chunks/4828.d492d00926b4c1d3.js',
          revision: 'd492d00926b4c1d3',
        },
        {
          url: '/_next/static/chunks/4858.9b40fc23a6aca14b.js',
          revision: '9b40fc23a6aca14b',
        },
        {
          url: '/_next/static/chunks/4876a6de.ed25a1c4245991ea.js',
          revision: 'ed25a1c4245991ea',
        },
        {
          url: '/_next/static/chunks/4998-879d06831a7532ad.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/5034.137d80a73b706030.js',
          revision: '137d80a73b706030',
        },
        {
          url: '/_next/static/chunks/5114.28396d57dea8c271.js',
          revision: '28396d57dea8c271',
        },
        {
          url: '/_next/static/chunks/5130.6b3f49b8a2f688e4.js',
          revision: '6b3f49b8a2f688e4',
        },
        {
          url: '/_next/static/chunks/55393f3c.1e4ffeaec956651c.js',
          revision: '1e4ffeaec956651c',
        },
        {
          url: '/_next/static/chunks/5570.baa48b6316f62537.js',
          revision: 'baa48b6316f62537',
        },
        {
          url: '/_next/static/chunks/5640-687482e2ca08d0a2.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/5655.8bbbf894d4dc5e09.js',
          revision: '8bbbf894d4dc5e09',
        },
        {
          url: '/_next/static/chunks/5705.5b82c3500ed0bdf5.js',
          revision: '5b82c3500ed0bdf5',
        },
        {
          url: '/_next/static/chunks/5740.64f15b8f297e0567.js',
          revision: '64f15b8f297e0567',
        },
        {
          url: '/_next/static/chunks/5900.eb74c67b9f3c6f27.js',
          revision: 'eb74c67b9f3c6f27',
        },
        {
          url: '/_next/static/chunks/59453ef0-ae40e87da2788d0f.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/6144-d1e69db476074cbe.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/6167-4e5e871a0ac304bf.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/6311.18534fe3ecfd23c9.js',
          revision: '18534fe3ecfd23c9',
        },
        {
          url: '/_next/static/chunks/6705-39bcc8eb1bbf2361.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/6831-50425a66b5ec1112.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/6994-af32327f2e132ce1.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/6b720719-46411e76f74b533d.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/7056-8a27eecf4ed89d63.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/7107.700a4639e63a2d2b.js',
          revision: '700a4639e63a2d2b',
        },
        {
          url: '/_next/static/chunks/7231-afb8f8a4df280b49.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/7377-6f2539c77e87a709.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/7497-f9cbfb44922da124.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/7592-d97aa8e5dd3035a0.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/7630-18a3e73cc8dcca10.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/7639-59e4420878f5a37f.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/7721.c2ba396c9ab9ae50.js',
          revision: 'c2ba396c9ab9ae50',
        },
        {
          url: '/_next/static/chunks/7747-3a8189f5e88e3851.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/7829-50516935513b95c8.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/7d1cab45-05d71a63fc96ca47.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/8227-57d9d79724c972d9.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/8335-bf8b55d6e3689a2f.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/842892ce-2f588daa9c9e23aa.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/8654-954910e94f589e32.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/8658-5f456dcc9c838c34.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/86cb00e6-74b757014bdf7f27.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/8907-36916f8d27bc392c.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/8937-546751777525905b.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/8947-5747f76c58e51278.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/8d312cd5.62ff19a389aca343.js',
          revision: '62ff19a389aca343',
        },
        {
          url: '/_next/static/chunks/8f130de0-dfad3b5050693471.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/930.bbded92dde72e306.js',
          revision: 'bbded92dde72e306',
        },
        {
          url: '/_next/static/chunks/9414-e9da229ccc734da7.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/9479-a3e86f9a431a3cd4.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/9509-5ff8a5ab353d0f98.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/9763d573-3887fcfb0e4f0676.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/9851-0dd9d3e94c7e407e.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/9f8fe0c5-3c5d81afa3ecea5e.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/(audience)/account-settings/page-f593e984c67e0149.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/(audience)/layout-cc04c3f9dda39eeb.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/(audience)/my-events/page-cd102b4a1b1ee3ef.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/(audience)/my-profile/page-cdc13a4adee1a1c7.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/(audience)/tickets-n-payments/page-eaa4287ce9a60772.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/layout-cb0e3498b6fa4703.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/organization/attendees/page-62c0e1cbcb998e42.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/organization/events/%5Bslug%5D/check-in/page-ded82060943c3c15.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/organization/events/%5Bslug%5D/create/page-6839e5527e371292.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/organization/events/%5Bslug%5D/home/page-a944971b73b41eb4.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/organization/events/%5Bslug%5D/overview/page-3886c2a469eb9992.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/organization/events/page-47bbee65ca598b76.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/organization/layout-8d1bd920ec7b5be8.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/organization/overview/page-d62e0359fc8a532a.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/organization/surveys/create/page-25717a70046e1237.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(authenticated)/organization/surveys/page-5c9cf6fcdc1475ec.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/email/change/%5Btoken%5D/page-70f5fea1b8ff02b8.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/email/verify/%5Btoken%5D/page-6c49ea9af8d57fae.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/email/verify/organization/%5Btoken%5D/page-99b1d5e36d68ca89.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/events/%5Bslug%5D/apply/page-79374a99ad0ceb8c.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/events/%5Bslug%5D/apply/result/page-a2e22b9bf9ae7d65.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/events/%5Bslug%5D/page-21839c48ba7eec88.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/forgot-password/page-9353f5c1a559f89f.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/app/(guest)/home/page-5fb60eb25af8642e.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/app/(guest)/layout-7c2aaff6b77d8d95.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/login/page-febf71d4bd940db8.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/organization/%5Bslug%5D/page-76b02288e0da26c0.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/organization/login/page-be321d288c4985d5.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/organization/register/page-4868af660dce88c1.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/register/page-647a22381cb3f825.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/reset-password/%5Btoken%5D/page-0e5352e8bc561b4c.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/search/page-0f4e675bb5485a13.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url:
            '/_next/static/chunks/app/(guest)/speaker/%5Bslug%5D/page-be77541a5b3ebb70.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/app/layout-bbd636d1ddbcf3d5.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/app/not-found-afc13627c46cbff7.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/b6a90a2d.99870ff2b8521125.js',
          revision: '99870ff2b8521125',
        },
        {
          url: '/_next/static/chunks/b8bc3934-8a88634d5affcb89.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/ba10a330-182f9369fc1f73a8.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/bdca310f-c690bf1b407e4471.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/c0f88409.1d411d1149057a0f.js',
          revision: '1d411d1149057a0f',
        },
        {
          url: '/_next/static/chunks/de30c250.03160ce11bc01ac3.js',
          revision: '03160ce11bc01ac3',
        },
        {
          url: '/_next/static/chunks/e9700330-0ff5b7778fe8980f.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/eb396988-c2b260bcdfb38d67.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/ed10ba65-fc58d19026d2525a.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/ed48eaa7.71d875bbf9763d58.js',
          revision: '71d875bbf9763d58',
        },
        {
          url: '/_next/static/chunks/efedfc4a-9fd932ca582b4123.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/f2eb1761-71fe33d8fb491276.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/fca6a955-0acb9725bfc20c38.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/fe0a3d05-345b0b3e9045fc56.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/framework-20afca218c33ed8b.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/main-7bcf26a9be188f63.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/main-app-ca874248da8cca6b.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/pages/_app-a2d20b7d3c52a661.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/pages/_error-524ede7bad304579.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js',
          revision: '837c0df77fd5009c9e46d446188ecfd0',
        },
        {
          url: '/_next/static/chunks/webpack-931b0548c68bf1cb.js',
          revision: 'HAOG2uy3FPz-uoeXHE-gi',
        },
        {
          url: '/_next/static/css/057e3bc40c3a7605.css',
          revision: '057e3bc40c3a7605',
        },
        {
          url: '/_next/static/css/0af24c46b063a381.css',
          revision: '0af24c46b063a381',
        },
        {
          url: '/_next/static/css/0e6ecbebf8e0a7f3.css',
          revision: '0e6ecbebf8e0a7f3',
        },
        {
          url: '/_next/static/css/18b9c48be98ac203.css',
          revision: '18b9c48be98ac203',
        },
        {
          url: '/_next/static/css/1f7d6664722644ea.css',
          revision: '1f7d6664722644ea',
        },
        {
          url: '/_next/static/css/2c521400eb2895bb.css',
          revision: '2c521400eb2895bb',
        },
        {
          url: '/_next/static/css/493d91ffa2396524.css',
          revision: '493d91ffa2396524',
        },
        {
          url: '/_next/static/css/4ffec14af9ada095.css',
          revision: '4ffec14af9ada095',
        },
        {
          url: '/_next/static/css/5fa53fec05b4975b.css',
          revision: '5fa53fec05b4975b',
        },
        {
          url: '/_next/static/css/63516b7b0d9e3452.css',
          revision: '63516b7b0d9e3452',
        },
        {
          url: '/_next/static/css/7c0d173e20014be7.css',
          revision: '7c0d173e20014be7',
        },
        {
          url: '/_next/static/css/82127676c8a3582e.css',
          revision: '82127676c8a3582e',
        },
        {
          url: '/_next/static/css/8b81c6584e9c0244.css',
          revision: '8b81c6584e9c0244',
        },
        {
          url: '/_next/static/css/8fadd42e04e663a4.css',
          revision: '8fadd42e04e663a4',
        },
        {
          url: '/_next/static/css/97aa99aa7dd4b361.css',
          revision: '97aa99aa7dd4b361',
        },
        {
          url: '/_next/static/css/99626d4c502d4748.css',
          revision: '99626d4c502d4748',
        },
        {
          url: '/_next/static/css/9d4020621ef4535a.css',
          revision: '9d4020621ef4535a',
        },
        {
          url: '/_next/static/css/b6be79c99b43d102.css',
          revision: 'b6be79c99b43d102',
        },
        {
          url: '/_next/static/css/c59c3b7ad9029084.css',
          revision: 'c59c3b7ad9029084',
        },
        {
          url: '/_next/static/css/c68c8027e2c9e151.css',
          revision: 'c68c8027e2c9e151',
        },
        {
          url: '/_next/static/css/cb14f8cdf74a64dd.css',
          revision: 'cb14f8cdf74a64dd',
        },
        {
          url: '/_next/static/css/e76e1f61558474ab.css',
          revision: 'e76e1f61558474ab',
        },
        {
          url: '/_next/static/css/ee0c7c9ecb35bbe5.css',
          revision: 'ee0c7c9ecb35bbe5',
        },
        {
          url: '/_next/static/media/046b90749014f852-s.woff2',
          revision: '19bf2a23f7f672153135a9d1918f6f9a',
        },
        {
          url: '/_next/static/media/26a46d62cd723877-s.woff2',
          revision: 'befd9c0fdfa3d8a645d5f95717ed6420',
        },
        {
          url: '/_next/static/media/55c55f0601d81cf3-s.woff2',
          revision: '43828e14271c77b87e3ed582dbff9f74',
        },
        {
          url: '/_next/static/media/581909926a08bbc8-s.woff2',
          revision: 'f0b86e7c24f455280b8df606b89af891',
        },
        {
          url: '/_next/static/media/67110d8fe39c5e84-s.woff2',
          revision: '91c073ec3046c2fc252900a89b6fc5d0',
        },
        {
          url: '/_next/static/media/6aacc40b7795b725-s.woff2',
          revision: '48e07fe2ca9c3bc32d09affb2ace8844',
        },
        {
          url: '/_next/static/media/6d93bde91c0c2823-s.woff2',
          revision: '621a07228c8ccbfd647918f1021b4868',
        },
        {
          url: '/_next/static/media/848b99572ad207f3-s.woff2',
          revision: '31904e07bc2fac21149accd8a82eb1b1',
        },
        {
          url: '/_next/static/media/97e0cb1ae144a2a9-s.woff2',
          revision: 'e360c61c5bd8d90639fd4503c829c2dc',
        },
        {
          url: '/_next/static/media/999e639cd9d85971-s.woff2',
          revision: '59533f46ae2b6e4fed5c133c03ea0608',
        },
        {
          url: '/_next/static/media/KaTeX_AMS-Regular.1608a09b.woff',
          revision: '1608a09b',
        },
        {
          url: '/_next/static/media/KaTeX_AMS-Regular.4aafdb68.ttf',
          revision: '4aafdb68',
        },
        {
          url: '/_next/static/media/KaTeX_AMS-Regular.a79f1c31.woff2',
          revision: 'a79f1c31',
        },
        {
          url: '/_next/static/media/KaTeX_Caligraphic-Bold.b6770918.woff',
          revision: 'b6770918',
        },
        {
          url: '/_next/static/media/KaTeX_Caligraphic-Bold.cce5b8ec.ttf',
          revision: 'cce5b8ec',
        },
        {
          url: '/_next/static/media/KaTeX_Caligraphic-Bold.ec17d132.woff2',
          revision: 'ec17d132',
        },
        {
          url: '/_next/static/media/KaTeX_Caligraphic-Regular.07ef19e7.ttf',
          revision: '07ef19e7',
        },
        {
          url: '/_next/static/media/KaTeX_Caligraphic-Regular.55fac258.woff2',
          revision: '55fac258',
        },
        {
          url: '/_next/static/media/KaTeX_Caligraphic-Regular.dad44a7f.woff',
          revision: 'dad44a7f',
        },
        {
          url: '/_next/static/media/KaTeX_Fraktur-Bold.9f256b85.woff',
          revision: '9f256b85',
        },
        {
          url: '/_next/static/media/KaTeX_Fraktur-Bold.b18f59e1.ttf',
          revision: 'b18f59e1',
        },
        {
          url: '/_next/static/media/KaTeX_Fraktur-Bold.d42a5579.woff2',
          revision: 'd42a5579',
        },
        {
          url: '/_next/static/media/KaTeX_Fraktur-Regular.7c187121.woff',
          revision: '7c187121',
        },
        {
          url: '/_next/static/media/KaTeX_Fraktur-Regular.d3c882a6.woff2',
          revision: 'd3c882a6',
        },
        {
          url: '/_next/static/media/KaTeX_Fraktur-Regular.ed38e79f.ttf',
          revision: 'ed38e79f',
        },
        {
          url: '/_next/static/media/KaTeX_Main-Bold.b74a1a8b.ttf',
          revision: 'b74a1a8b',
        },
        {
          url: '/_next/static/media/KaTeX_Main-Bold.c3fb5ac2.woff2',
          revision: 'c3fb5ac2',
        },
        {
          url: '/_next/static/media/KaTeX_Main-Bold.d181c465.woff',
          revision: 'd181c465',
        },
        {
          url: '/_next/static/media/KaTeX_Main-BoldItalic.6f2bb1df.woff2',
          revision: '6f2bb1df',
        },
        {
          url: '/_next/static/media/KaTeX_Main-BoldItalic.70d8b0a5.ttf',
          revision: '70d8b0a5',
        },
        {
          url: '/_next/static/media/KaTeX_Main-BoldItalic.e3f82f9d.woff',
          revision: 'e3f82f9d',
        },
        {
          url: '/_next/static/media/KaTeX_Main-Italic.47373d1e.ttf',
          revision: '47373d1e',
        },
        {
          url: '/_next/static/media/KaTeX_Main-Italic.8916142b.woff2',
          revision: '8916142b',
        },
        {
          url: '/_next/static/media/KaTeX_Main-Italic.9024d815.woff',
          revision: '9024d815',
        },
        {
          url: '/_next/static/media/KaTeX_Main-Regular.0462f03b.woff2',
          revision: '0462f03b',
        },
        {
          url: '/_next/static/media/KaTeX_Main-Regular.7f51fe03.woff',
          revision: '7f51fe03',
        },
        {
          url: '/_next/static/media/KaTeX_Main-Regular.b7f8fe9b.ttf',
          revision: 'b7f8fe9b',
        },
        {
          url: '/_next/static/media/KaTeX_Math-BoldItalic.572d331f.woff2',
          revision: '572d331f',
        },
        {
          url: '/_next/static/media/KaTeX_Math-BoldItalic.a879cf83.ttf',
          revision: 'a879cf83',
        },
        {
          url: '/_next/static/media/KaTeX_Math-BoldItalic.f1035d8d.woff',
          revision: 'f1035d8d',
        },
        {
          url: '/_next/static/media/KaTeX_Math-Italic.5295ba48.woff',
          revision: '5295ba48',
        },
        {
          url: '/_next/static/media/KaTeX_Math-Italic.939bc644.ttf',
          revision: '939bc644',
        },
        {
          url: '/_next/static/media/KaTeX_Math-Italic.f28c23ac.woff2',
          revision: 'f28c23ac',
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Bold.8c5b5494.woff2',
          revision: '8c5b5494',
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Bold.94e1e8dc.ttf',
          revision: '94e1e8dc',
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Bold.bf59d231.woff',
          revision: 'bf59d231',
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Italic.3b1e59b3.woff2',
          revision: '3b1e59b3',
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Italic.7c9bc82b.woff',
          revision: '7c9bc82b',
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Italic.b4c20c84.ttf',
          revision: 'b4c20c84',
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Regular.74048478.woff',
          revision: '74048478',
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Regular.ba21ed5f.woff2',
          revision: 'ba21ed5f',
        },
        {
          url: '/_next/static/media/KaTeX_SansSerif-Regular.d4d7ba48.ttf',
          revision: 'd4d7ba48',
        },
        {
          url: '/_next/static/media/KaTeX_Script-Regular.03e9641d.woff2',
          revision: '03e9641d',
        },
        {
          url: '/_next/static/media/KaTeX_Script-Regular.07505710.woff',
          revision: '07505710',
        },
        {
          url: '/_next/static/media/KaTeX_Script-Regular.fe9cbbe1.ttf',
          revision: 'fe9cbbe1',
        },
        {
          url: '/_next/static/media/KaTeX_Size1-Regular.e1e279cb.woff',
          revision: 'e1e279cb',
        },
        {
          url: '/_next/static/media/KaTeX_Size1-Regular.eae34984.woff2',
          revision: 'eae34984',
        },
        {
          url: '/_next/static/media/KaTeX_Size1-Regular.fabc004a.ttf',
          revision: 'fabc004a',
        },
        {
          url: '/_next/static/media/KaTeX_Size2-Regular.57727022.woff',
          revision: '57727022',
        },
        {
          url: '/_next/static/media/KaTeX_Size2-Regular.5916a24f.woff2',
          revision: '5916a24f',
        },
        {
          url: '/_next/static/media/KaTeX_Size2-Regular.d6b476ec.ttf',
          revision: 'd6b476ec',
        },
        {
          url: '/_next/static/media/KaTeX_Size3-Regular.9acaf01c.woff',
          revision: '9acaf01c',
        },
        {
          url: '/_next/static/media/KaTeX_Size3-Regular.a144ef58.ttf',
          revision: 'a144ef58',
        },
        {
          url: '/_next/static/media/KaTeX_Size3-Regular.b4230e7e.woff2',
          revision: 'b4230e7e',
        },
        {
          url: '/_next/static/media/KaTeX_Size4-Regular.10d95fd3.woff2',
          revision: '10d95fd3',
        },
        {
          url: '/_next/static/media/KaTeX_Size4-Regular.7a996c9d.woff',
          revision: '7a996c9d',
        },
        {
          url: '/_next/static/media/KaTeX_Size4-Regular.fbccdabe.ttf',
          revision: 'fbccdabe',
        },
        {
          url: '/_next/static/media/KaTeX_Typewriter-Regular.6258592b.woff',
          revision: '6258592b',
        },
        {
          url: '/_next/static/media/KaTeX_Typewriter-Regular.a8709e36.woff2',
          revision: 'a8709e36',
        },
        {
          url: '/_next/static/media/KaTeX_Typewriter-Regular.d97aaf4a.ttf',
          revision: 'd97aaf4a',
        },
        {
          url: '/_next/static/media/a34f9d1faa5f3315-s.p.woff2',
          revision: 'd4fe31e6a2aebc06b8d6e558c9141119',
        },
        {
          url: '/_next/static/media/c97d4358b5ad6f1f-s.p.woff2',
          revision: '748da8fce84b0b6ee83bacd60aed2979',
        },
        {
          url: '/_next/static/media/df0a9ae256c0569c-s.woff2',
          revision: 'd54db44de5ccb18886ece2fda72bdfe0',
        },
        {
          url: '/_next/static/media/e6b5cfd5a74e1cae-s.woff2',
          revision: '8358e3d9b140dd03a59878681e98a5e4',
        },
        {
          url: '/_next/static/media/layers-2x.9859cd12.png',
          revision: '9859cd12',
        },
        {
          url: '/_next/static/media/layers.ef6db872.png',
          revision: 'ef6db872',
        },
        {
          url: '/_next/static/media/logo.7bae3aac.png',
          revision: '860d26189ce9a1a6b93bbb4738c88531',
        },
        {
          url: '/_next/static/media/marker-icon-2x.93fdb12c.png',
          revision: '93fdb12c',
        },
        {
          url: '/_next/static/media/marker-icon.d577052a.png',
          revision: 'd577052a',
        },
        {
          url: '/_next/static/media/marker-shadow.612e3b52.png',
          revision: '612e3b52',
        },
        { url: '/favicon.ico', revision: '69308f703d795875b36d4fec9af5674e' },
        {
          url: '/firebase-messaging-sw.js',
          revision: '3d6cc12739610401b9ee2c0ae53154ae',
        },
        {
          url: '/icons/3-columns.svg',
          revision: 'c71343d858e6f9ba14e7c4a5790687ef',
        },
        {
          url: '/icons/LICENSE.md',
          revision: 'cca42d84ae1c962be5709226ebf5ddb0',
        },
        {
          url: '/icons/account-settings.svg',
          revision: 'f4969824b267804f7b4bc08112f8492a',
        },
        {
          url: '/icons/apple-touch-icon.png',
          revision: '15863676c11a18dd50db0c3a946b73ad',
        },
        {
          url: '/icons/arrow-clockwise.svg',
          revision: '20af9929996ec6d1bb5ed99c8499fe4d',
        },
        {
          url: '/icons/arrow-counterclockwise.svg',
          revision: '484f2ec86638328c2edc463036dc75c8',
        },
        {
          url: '/icons/attendees.svg',
          revision: '9b643ba06eda012da29fdc976579d691',
        },
        {
          url: '/icons/bg-color.svg',
          revision: '2221dd34105d442d8a7d5cefee3f60b3',
        },
        {
          url: '/icons/camera.svg',
          revision: '76f0880cf1590e4eadcaa76b0000c684',
        },
        {
          url: '/icons/card-checklist.svg',
          revision: 'b02efdb39bd99ecdf52b2d281dee0b8f',
        },
        {
          url: '/icons/caret-right-fill.svg',
          revision: 'c9b6b65b47434b0acccddad128d38bf6',
        },
        {
          url: '/icons/chat-left-text.svg',
          revision: 'bbcdd0bb5b896e5ed618641683b8d9f9',
        },
        {
          url: '/icons/chat-right-dots.svg',
          revision: '4ffcce0bae86328c84dd85b5d352d3e9',
        },
        {
          url: '/icons/chat-right-text.svg',
          revision: '3baf458157708ea57d55b6a28460d564',
        },
        {
          url: '/icons/chat-right.svg',
          revision: 'e6d5e540cf768973608cf2f870db3407',
        },
        {
          url: '/icons/chat-square-quote.svg',
          revision: '1c13e98c865a480626ca6166649c4c0d',
        },
        {
          url: '/icons/chevron-down.svg',
          revision: 'a5b6819b807f9393209e1d4d13a833b8',
        },
        {
          url: '/icons/clipboard.svg',
          revision: '71342abe8f8be473e7405111be1997fe',
        },
        {
          url: '/icons/close.svg',
          revision: 'f5111469fe89132e11350033b7775282',
        },
        {
          url: '/icons/code.svg',
          revision: '2910058ae70695cdffc03ffb5126cdc0',
        },
        {
          url: '/icons/comments.svg',
          revision: 'b2f5bc85e777969c66b59abe837a2be2',
        },
        {
          url: '/icons/copy.svg',
          revision: 'be0ed090765d95ccda63d0ef6261047f',
        },
        {
          url: '/icons/create-event.svg',
          revision: 'c957c78c9f67623c731bce29126982da',
        },
        {
          url: '/icons/diagram-2.svg',
          revision: '1c4e3d95658241b99ddc8c0bb755c33a',
        },
        {
          url: '/icons/download.svg',
          revision: '112aeee86fb6498587f65a06001671c1',
        },
        {
          url: '/icons/draggable-block-menu.svg',
          revision: 'ddc160adca422d9e046a0d7780dcc0a3',
        },
        {
          url: '/icons/dropdown-more.svg',
          revision: '705a98dc4d7ab3dd2955a8239a17ca20',
        },
        {
          url: '/icons/event-planning.svg',
          revision: 'a24b8aa1951045dd6c70574b7e0d677a',
        },
        {
          url: '/icons/event.svg',
          revision: 'e340a0fc1ee2dd3160372926402e66b8',
        },
        {
          url: '/icons/favicon-16x16.png',
          revision: 'ac3a38180c45837cd71eea4535cba2fd',
        },
        {
          url: '/icons/favicon-32x32.png',
          revision: '62089671af16a3fd22fe29bd45243e3b',
        },
        {
          url: '/icons/favicon.ico',
          revision: 'fdf6759148870a79c2446bd452d19637',
        },
        {
          url: '/icons/figma.svg',
          revision: '1a60a1dad86bd1a3cfc24e11cdfc0689',
        },
        {
          url: '/icons/file-earmark-text.svg',
          revision: 'bad1ade32a9bed6e803980eb106f2c4d',
        },
        {
          url: '/icons/file-image.svg',
          revision: '2e1d3f5a0f76524683b753ace921c785',
        },
        {
          url: '/icons/filetype-gif.svg',
          revision: '06e2e969935021403c763f24608e49fb',
        },
        {
          url: '/icons/font-color.svg',
          revision: '0459531d6a582414e04fb7d4b24af9f2',
        },
        {
          url: '/icons/font-family.svg',
          revision: 'c38b25c9e159f8ecd0e2e81cec32dc4b',
        },
        {
          url: '/icons/gear.svg',
          revision: 'eea1381b3d3e0ffa016daeadd3fd605a',
        },
        {
          url: '/icons/horizontal-rule.svg',
          revision: '1ccc190054a8cb561b4a51afc415cb59',
        },
        {
          url: '/icons/icon-192x192.png',
          revision: '312c81c554823fc64470358b907045c0',
        },
        {
          url: '/icons/icon-512x512.png',
          revision: 'f4c8048c078a0b491bab63cf76d3fee2',
        },
        {
          url: '/icons/indent.svg',
          revision: '435630bb3a834c81419a1a0c952a2108',
        },
        {
          url: '/icons/journal-code.svg',
          revision: 'd9298672472f19baf44670e74326afa1',
        },
        {
          url: '/icons/journal-text.svg',
          revision: 'b0e0f7b104d48a59b0cc1312670445cf',
        },
        {
          url: '/icons/justify.svg',
          revision: '2c857b5465788f14e527e1d6c2a29e17',
        },
        {
          url: '/icons/link.svg',
          revision: '2c9f386c4289014e0cb2cc515c8fb4a7',
        },
        {
          url: '/icons/list-ol.svg',
          revision: '0503827e026add484dce506190b74855',
        },
        {
          url: '/icons/list-ul.svg',
          revision: '9ad69fe6b6700598e703d9944c7cad73',
        },
        {
          url: '/icons/lock-fill.svg',
          revision: '915ab8faf5d73808e9784033d87c8dce',
        },
        {
          url: '/icons/lock.svg',
          revision: '255c6320df718ff10fa5e0117bf46079',
        },
        {
          url: '/icons/markdown.svg',
          revision: '3929ec107ad1fea7f668e7051546ba91',
        },
        { url: '/icons/mic.svg', revision: '67500485d323eb413589912f0db627e6' },
        {
          url: '/icons/not-found.png',
          revision: '780a09f5395a44bb49a83a111ef2f509',
        },
        {
          url: '/icons/notification.png',
          revision: 'd17d014a6b32c45a87a9cc5312fecdfd',
        },
        {
          url: '/icons/notification.svg',
          revision: '05e114facea4dafebd8ba4cdd97f6c4b',
        },
        {
          url: '/icons/outdent.svg',
          revision: 'aa51f2a47f71901f6f08bf63e43c7cf4',
        },
        {
          url: '/icons/overview.svg',
          revision: '2522b5e07727ef653ce364d44339eb93',
        },
        {
          url: '/icons/paint-bucket.svg',
          revision: '1217883610bc45da2473a51c71aeff4c',
        },
        {
          url: '/icons/palette.svg',
          revision: '46ac8c1f470ddf287f1db10439aa1871',
        },
        {
          url: '/icons/payment.svg',
          revision: '7689b767c3d7de3a14e926de2413d23f',
        },
        {
          url: '/icons/pencil-fill.svg',
          revision: 'fdefed755e922e62a708ed76bd820847',
        },
        {
          url: '/icons/photos.svg',
          revision: '263c6561d4a7eb83403513a388cc351d',
        },
        {
          url: '/icons/plug-fill.svg',
          revision: 'b400362065d0bf0973f1c0753b7944ee',
        },
        {
          url: '/icons/plug.svg',
          revision: 'a23d27d08bc8f6a896107436386d61c6',
        },
        {
          url: '/icons/plus-slash-minus.svg',
          revision: '6a92c76a0bf853abb5a6e9f9420133d2',
        },
        {
          url: '/icons/plus.svg',
          revision: '1320a8c7ef5ade602042d319af153050',
        },
        {
          url: '/icons/prettier-error.svg',
          revision: '1b80e129660bd023fcd152b50dd789ab',
        },
        {
          url: '/icons/prettier.svg',
          revision: '778bc2e4f23684f42293e1c05dbe29eb',
        },
        {
          url: '/icons/profile.svg',
          revision: 'dcf379fc07dab69f013ef7ee7566aeb5',
        },
        {
          url: '/icons/scissors.svg',
          revision: 'ffa29bbf3caaa6785c15cb96480197a2',
        },
        {
          url: '/icons/send.svg',
          revision: 'f58eea60e3c4db07d7308f49c8e4de1b',
        },
        {
          url: '/icons/site.webmanifest',
          revision: 'fb7c35a3cb72cd158a16e56eef57601f',
        },
        {
          url: '/icons/square-check.svg',
          revision: 'db92dc9b301cb75158c706e89a60099a',
        },
        {
          url: '/icons/staff.svg',
          revision: '2bf7a19147a3eca10da14b144f1c4418',
        },
        {
          url: '/icons/sticky.svg',
          revision: '6f4b86dc6867931490b9ccc12bf28d75',
        },
        {
          url: '/icons/success-alt.svg',
          revision: 'fdf513968d89e05f21d2a3042b85dfee',
        },
        {
          url: '/icons/success.svg',
          revision: '5f485d960bf0185de099c88034c3eae9',
        },
        {
          url: '/icons/survey.svg',
          revision: '397e640320baa132fae04cbfeb9fb534',
        },
        {
          url: '/icons/table.svg',
          revision: 'fa350b49214ef3b8c46cd4a62743ebdd',
        },
        {
          url: '/icons/text-center.svg',
          revision: 'a9999d142e6841a0bc89fb9ce373b7c0',
        },
        {
          url: '/icons/text-left.svg',
          revision: '275f25ded9f7ffaf9168aede456cdb8d',
        },
        {
          url: '/icons/text-paragraph.svg',
          revision: 'f7fb895062488af4183c2caf7f000478',
        },
        {
          url: '/icons/text-right.svg',
          revision: 'af82540e49c0643552dcd7dbfbc0a352',
        },
        {
          url: '/icons/ticket-payment.svg',
          revision: 'f52fcf9971b731b987d17297dc9acf1d',
        },
        {
          url: '/icons/ticket.svg',
          revision: 'efe47ed46843615c294855afa178dbab',
        },
        {
          url: '/icons/trash.svg',
          revision: '17acb84ece8336dcd21f7472e1366940',
        },
        {
          url: '/icons/trash3.svg',
          revision: '6fd60826d6eb595a46611ff2e2f93677',
        },
        {
          url: '/icons/tweet.svg',
          revision: 'c76d3ef23f00faadd36b2483224ef3eb',
        },
        {
          url: '/icons/type-bold.svg',
          revision: '61a07cb251774f5bbe3787a17e617714',
        },
        {
          url: '/icons/type-h1.svg',
          revision: 'fb4b6cb55e58e6b0224aaffe435817ba',
        },
        {
          url: '/icons/type-h2.svg',
          revision: 'bcb36d7e6e3f82c1984d42cc3c81414c',
        },
        {
          url: '/icons/type-h3.svg',
          revision: 'd5cfb6df5edf71f935c1d6afde5cec24',
        },
        {
          url: '/icons/type-h4.svg',
          revision: '70907992d2222793a03f036b95443dc4',
        },
        {
          url: '/icons/type-h5.svg',
          revision: 'c5ab0b056368427e4f0edee2a085ca7a',
        },
        {
          url: '/icons/type-h6.svg',
          revision: '4382db036bb2a9e9f94d88c36e4a1da5',
        },
        {
          url: '/icons/type-italic.svg',
          revision: '8cadb971174329b32e68e2c08a18370c',
        },
        {
          url: '/icons/type-strikethrough.svg',
          revision: '303fedc11e429a1029ef6fe97abf7228',
        },
        {
          url: '/icons/type-subscript.svg',
          revision: '2ab9b85708c4a6db2f6558ac5e127d1c',
        },
        {
          url: '/icons/type-superscript.svg',
          revision: '3653369848b24348acb00e4ea40011b2',
        },
        {
          url: '/icons/type-underline.svg',
          revision: 'e3cb589689e14cabba0c332b12e4ccfb',
        },
        {
          url: '/icons/upload.svg',
          revision: 'b67394a2d15910b63ab81532c757753f',
        },
        {
          url: '/icons/user.svg',
          revision: '73c077ae8e41bb53e995d29b0e4476ab',
        },
        {
          url: '/icons/youtube.svg',
          revision: 'bacc9e5f38edfad48b7ce128c0841591',
        },
        {
          url: '/images/change_email.png',
          revision: '682c0707ac294e19968cf7c803792b28',
        },
        {
          url: '/images/event-list.png',
          revision: '47c2684164533c5f2bef5fe1e1bb3c40',
        },
        {
          url: '/images/invalid.png',
          revision: '827f07110f720616d370a3d1cdb99420',
        },
        {
          url: '/images/mail-truck.gif',
          revision: 'aa8699ece36d2e1c975688124885a7c7',
        },
        {
          url: '/images/sales.png',
          revision: '1a8953a7c694d9b60d0c57e0acff1116',
        },
        {
          url: '/images/smartphone.png',
          revision: '57157f01c892097e71b7a630a1196182',
        },
        {
          url: '/images/team.png',
          revision: 'b71a182acc92fb2b5e04899710cd44d0',
        },
        {
          url: '/images/technology.png',
          revision: '6e1d5eae29b01ea1c2eaa83134583d76',
        },
        {
          url: '/images/ticket.png',
          revision: '8c7bf10f6793f4bd8b515c4064bafa75',
        },
        {
          url: '/logo/event_ticket_statistics_2025-05-21T15:30:30.txt',
          revision: 'cb02275bfae101563e20e511818a0e30',
        },
        { url: '/logo/logo.png', revision: '860d26189ce9a1a6b93bbb4738c88531' },
        { url: '/manifest.json', revision: 'ac740468133e2846d903ea003bf60865' },
        { url: '/pwa-sw.js', revision: 'eb65416b2be7ccca77c7ad3d1d713246' },
        {
          url: '/screenshots/home-narrow.png',
          revision: 'a0f828c9f4c24e2acca04d5389023c91',
        },
        {
          url: '/screenshots/home-wide.png',
          revision: '23aa173bd57d70f923480f70b8dbfe9d',
        },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: i,
              event: s,
              state: a,
            }) =>
              i && 'opaqueredirect' === i.type
                ? new Response(i.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: i.headers,
                  })
                : i,
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const i = e.pathname;
        return !i.startsWith('/api/auth/') && !!i.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET',
    );
});
