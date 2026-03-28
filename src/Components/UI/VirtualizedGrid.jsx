import React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';

const VirtualizedGrid = ({ items, renderItem, columns = 3, rowHeight = 400, containerHeight = 800 }) => {
  const rowCount = Math.ceil(items.length / columns);
  
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columns + columnIndex;
    if (index >= items.length) return null;
    const item = items[index];
    
    return (
      <div style={style}>
        {renderItem(item, index)}
      </div>
    );
  };
  
  return (
    <Grid
      columnCount={columns}
      columnWidth={400}
      height={containerHeight}
      rowCount={rowCount}
      rowHeight={rowHeight}
      width="100%"
    >
      {Cell}
    </Grid>
  );
};

export default VirtualizedGrid;