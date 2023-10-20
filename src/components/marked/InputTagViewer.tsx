import Grid from "@mui/material/Grid";
export default function InputTagViewer({ element, order, state, setState }) {
  return (
    <Grid container spacing={2}>
      <Grid item>{element.outerHTML}</Grid>

      <Grid item>
        <input value={state} onChange={(e) => setState(e.target.value)}></input>
      </Grid>
      <Grid item>
        <span>{state}</span>
      </Grid>
    </Grid>
  );
}
