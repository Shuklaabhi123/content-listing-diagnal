import React from 'react';

interface GridItemProps {
  title: string;
  imageUrl: string;
}

const GridItem: React.FC<GridItemProps> = ({ title, imageUrl }) => {
  return (
    <div className="grid-item">
      <img id={title} src={imageUrl} alt={title} />
      <h3>{title}</h3>
    </div>
  );
};

export default GridItem;
