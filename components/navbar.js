import Link from "next/link";

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
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
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}></Typography>
          <Button>
            <Link href="/account">
              <a>
                <LibraryBooksIcon />
              </a>
            </Link>
          </Button>
          <Button>
            <Link href="/customers">
              <a>
                <PeopleIcon />
              </a>
            </Link>
          </Button>
          <Button>
            <Link href="/transactions">
              <a>
                <HistoryIcon />
              </a>
            </Link>
          </Button>
          <Button color="inherit">
            <a href="/api/auth/logout">Logout</a>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
