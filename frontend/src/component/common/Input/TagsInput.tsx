'use client';

import { styles } from '@/src/constant/styles.constant';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';

export default function TagsInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [tags, setTags] = useState([]);

  function remove(tag: string) {
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
  }

  function removeAll() {
    if (inputRef.current) inputRef.current.value = '';
    setTags([]);
  }

  function handleTag(e) {
    if (e.key === 'Enter') {
      e.preventDefault();

      // Replace tab or more one space = 1 space
      const tag = e.target.value.replace(/\s+/g, ' ');
      if (tag.length > 1) {
        // TODO: Filter invalid tag
        const tagSplit = tag
          .split(/,/)
          .filter((t: string) => !(t && t.length <= 1))
          .filter(Boolean)
          .slice(0, 5);

        // TODO: Add multiple tags by comma
        tagSplit.forEach((t: string) => {
          if (!tags.includes(t)) {
            setTags((prevTags) => [...prevTags, t.trim()]);
          }
        });
      }

      // Clear input
      e.target.value = '';
    }

    if (e.key === 'Backspace' && tags.length && !e.target.value) {
      e.target.value = tags.at(-1);
      e.preventDefault();
      setTags((prevTags) => prevTags.slice(0, -1));
    }
  }

  return (
    <div className='border border-gray-300 rounded-sm'>
      <div className={clsx('max-h-[100px] overflow-y-scroll p-1')}>
        {tags.length > 0 &&
          tags.map((tag) => (
            <li
              key={tag}
              className={clsx(
                'text-primary bg-info-sub border rounded-sm w-fit mb-[6px] mr-[6px] p-1',
                styles.flexStart,
                'gap-3 inline-flex',
              )}
            >
              <span className='break-all max-w-[90%]'>{'#' + tag}</span>
              <IoClose onClick={() => remove(tag)} className='min-w-5 cursor-pointer' />
            </li>
          ))}
      </div>
      <input
        ref={inputRef}
        onKeyDown={handleTag}
        placeholder='Press tag name'
        className='focus:outline-none py-2 px-1 w-full border-t border-t-blue-sub focus:border-t-primary'
      />

      <button
        className='w-full px-3 py-2 transition-all hover:bg-green-sub border-t border-t-green-sub hover:text-green-main'
        onClick={removeAll}
      >
        More tags +
      </button>
    </div>
  );
}
