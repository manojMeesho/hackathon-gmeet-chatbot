import { Breadcrumbs, Link, Typography } from "@mui/material";

export function Nav({ onBack }: { onBack: () => void }) {
  return (
    <Breadcrumbs>
      <Link
        underline="hover"
        color="primary"
        component="button"
        onClick={onBack}
      >
        GO TO LIST
      </Link>
      <Typography color="text.primary">DETAILS</Typography>
    </Breadcrumbs>
  );
}
