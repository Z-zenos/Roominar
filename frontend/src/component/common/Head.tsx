'use client';

import type { FC } from 'react';
import React from 'react';

interface HeadProps {
  title: string;
  description: string;
  keywords: string;
  imageUrl?: string;
}

const Head: FC<HeadProps> = ({ title, description, keywords, imageUrl }) => {
  return (
    <>
      <title>{title}</title>
      <meta
        property='og:title'
        content={title}
      />

      <meta
        name='viewport'
        content='width=device-width, initial-scale=1'
      />
      <meta
        name='description'
        content={description}
        key='desc'
      />
      <meta
        property='og:description'
        content={description}
      />

      <meta
        name='keywords'
        content={keywords}
      />

      {/* <meta
        property='og:image'
        content={
          imageUrl &&
          'https://avatars.githubusercontent.com/u/168013536?s=400&u=70bb0e54fe8f64dc89004de4370d33a25016a1ec&v=4'
        }
      /> */}
    </>
  );
};

export default Head;
