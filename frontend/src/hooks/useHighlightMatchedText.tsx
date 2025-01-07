import { useCallback } from 'react';

function useHighlightMatchedText() {
  const highlightText = useCallback((text: string, keyword: string) => {
    const index = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <span className='bg-yellow-300'>
          {text.substring(index, index + keyword.length)}
        </span>
        {text.substring(index + keyword.length)}
      </>
    );
  }, []);

  return highlightText;
}

export default useHighlightMatchedText;
