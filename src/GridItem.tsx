import React, { useState, useRef, useEffect } from 'react';

interface GridItemProps {
  title: string;
  imageUrl: string;
}

const GridItem: React.FC<GridItemProps> = ({ title, imageUrl }) => {
  const [isVisible, setIsVisible] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!observer.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
            }
          });
        },
        { threshold: 0.1 }
      );
    }

    const imgElement = document.getElementById(title);
    if (imgElement) observer.current.observe(imgElement);

    return () => {
      if (imgElement) observer.current.unobserve(imgElement);
    };
  }, [title]);

  return (
    <div className="grid-item">
      <h3>{title}</h3>
      <img id={title} src={imageUrl} alt={title} />
      {/* {isVisible ? (
        <img id={title} src={imageUrl} alt={title} />
      ) : (
        <div className="placeholder">Loading Image...</div>
      )} */}
    </div>
  );
};

export default GridItem;
