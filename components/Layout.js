import Navbar from "./navbar";
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";

export default function SimpleContainer({ children }) {
  return (
    <React.Fragment>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="md">{children}</Container>
    </React.Fragment>
  );
}
