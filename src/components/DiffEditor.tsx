import { Box, Typography } from "@mui/material";

export default function DiffEditor({ diffInfo, mainLines, editLines }) {
  function getTextColor(val, isMain) {
    if (val === 1) {
      return "red";
    }
    if (val === 3) {
      if (isMain) return "red";
      return "green";
    }
    return "black";
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "90vw",
        maxHeight: "50vh",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Typography variant="h6">Diff Viewer</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            gap: 2,
          }}
        >
          <span
            style={{
              color: "red",
              border: "1px solid red",
              borderRadius: "5px",
              padding: "2px",
            }}
          >
            Red- Deleted
          </span>
          <span
            style={{
              color: "green",
              border: "1px solid green",
              borderRadius: "5px",
              padding: "2px",
            }}
          >
            Green- Newly added
          </span>
          <span
            style={{
              border: "1px solid black",
              borderRadius: "5px",
              padding: "2px",
            }}
          >
            Black- No change
          </span>
        </Box>
      </Box>

      {diffInfo?.map((diff, index) => {
        return (
          <Box sx={{ pading: "0px" }} key={index}>
            {Array.from(Array(diff?.originalLinesCount).keys())?.map((cnt) => (
              <h4
                key={`${index}_${cnt}`}
                style={{
                  paddingTop: "0px",
                  paddingBottom: "0px",
                  color: getTextColor(diff?.changeType, true),
                }}
              >
                {mainLines[diff.originalLineNumberStart - 1 + +cnt]}
              </h4>
            ))}
            {Array.from(Array(diff?.modifiedLinesCount).keys())?.map(
              (cnt) =>
                diff?.changeType !== 0 && (
                  <h4
                    key={`${index}_${cnt}_modified`}
                    style={{
                      paddingTop: "0px",
                      paddingBottom: "0px",
                      color: getTextColor(diff?.changeType, false),
                    }}
                  >
                    {editLines[diff.modifiedLineNumberStart - 1 + +cnt]}
                  </h4>
                )
            )}
          </Box>
        );
      })}

      {/* 
              <p>
                {diffText &&
                  diffText?.map((item, index) => (
                    <span key={index} style={{ color: getTextColor(item[0]) }}>
                      {item[1]}
                    </span>
                  ))}
              </p> */}
    </Box>
  );
}
