import { Grid as MUIGrid } from '@mui/material';

const Grid = (props) => {
  console.log('grid props', props);

  return (
    <MUIGrid
      container
      rowGap={props.rowGap}
      sx={props.style}
      data_id={props.data_id}
    >
      {props.children}
    </MUIGrid>
  );
};

export default Grid;
