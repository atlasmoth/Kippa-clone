import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./../../components/Layout";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CheckboxList({ id }) {
  const [uniqueDebt, setUniqueDebt] = useState([]);
  const [update, setUpdate] = useState({});
  const classes = useStyles();

  useEffect(() => {
    axios
      .get(`/api/debt?id=${id}`)
      .then(({ data: { docs } }) => {
        setUniqueDebt(
          docs
            .filter((d) => d._id === "in" || d._id === "out")
            .reduce((acc, curr) => {
              return [...acc, ...curr.items];
            }, [])
        );
      })
      .catch(console.log);
  }, [update]);

  function resolve(state) {
    const objId = state._id;
    delete state._id;
    axios
      .post("/api/transactions", {
        ...state,
        date: new Date().getTime(),
      })
      .then(async () => {
        await axios.put("/api/debt?id=" + objId, { ...state });
        setUpdate((u) => ({ ...u, type: "get" }));
      })
      .catch(console.log);
  }

  return (
    <Layout>
      <h3>Customer Name</h3>
      <p>
        Total &#x20A6;{" "}
        {uniqueDebt.reduce((acc, curr) => {
          return curr.type === "in"
            ? (acc += curr.amount)
            : (acc -= curr.amount);
        }, 0)}
      </p>
      <List className={classes.root}>
        {uniqueDebt.length > 0 &&
          uniqueDebt.map((u) => (
            <ListItem key={u._id} role={undefined} dense button>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": u.item }}
                  onChange={() => resolve(u)}
                />
              </ListItemIcon>
              <ListItemText
                id={u._id}
                primary={u.item}
                secondary={`Due on ${new Date(u.date).toDateString()}`}
              />
              {u.type === "in" && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="comments">
                    <ShareIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
      </List>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { id } = ctx.query;

  return {
    props: {
      id,
    },
  };
}
