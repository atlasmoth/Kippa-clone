import Link from "next/link";

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import PeopleIcon from "@material-ui/icons/People";
import HistoryIcon from "@material-ui/icons/History";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Box display="flex" justifyContent="space-around" alignItems="center">
            <Typography variant="h6" className={classes.title}>
              <Link href="/account">
                <a style={{ color: "#fff", textDecoration: "none" }}>
                  <LibraryBooksIcon />
                </a>
              </Link>
            </Typography>
            <Typography variant="h6" className={classes.title}>
              <Link href="/customers">
                <a style={{ color: "#fff", textDecoration: "none" }}>
                  <PeopleIcon />
                </a>
              </Link>
            </Typography>

            <Typography variant="h6" className={classes.title}>
              <Link href="/transactions">
                <a style={{ color: "#fff", textDecoration: "none" }}>
                  <HistoryIcon />
                </a>
              </Link>
            </Typography>
            <Typography variant="h6" className={classes.title}>
              <a
                style={{ color: "#fff", textDecoration: "none" }}
                href="/api/auth/logout"
              >
                Logout
              </a>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}
