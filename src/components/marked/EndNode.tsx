import Grid from "@mui/material/Grid";
export default function EndNode({ element }) {
  return (
    <Grid container spacing={2}>
      <Grid item>{element}</Grid>

      <Grid item>
        <Grid item>{element}</Grid>
      </Grid>
      <Grid item>
        <Grid item>{element}</Grid>
      </Grid>
    </Grid>
  );
}
