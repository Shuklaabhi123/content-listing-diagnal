import React from 'react';

interface GridItemProps {
  title: string;
  imageUrl: string;
}

const GridItem: React.FC<GridItemProps> = ({ title, imageUrl }) => {
  return (
    <div className="grid-item">
      <h3>{title}</h3>
      <img id={title} src={imageUrl} alt={title} />
    </div>
  );
};

export default GridItem;
