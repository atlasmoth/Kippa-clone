import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import Link from "next/link";
import Layout from "./../../components/Layout";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { Button } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function FolderList() {
  const [customers, setCustomers] = useState([]);
  const [update, setUpdate] = useState({});
  const [phone, setPhone] = useState();
  const [balance, setbalance] = useState(0);
  function handleSubmit(e) {
    e.preventDefault();
    const state = Object.fromEntries(new FormData(e.target));
    axios
      .post("/api/customers", { ...state, phone })
      .then(() => {
        setUpdate((u) => ({ ...u, type: "get" }));
      })
      .catch(console.log);
  }
  useEffect(() => {
    axios
      .get("/api/customers")
      .then(({ data: { docs } }) => {
        const total = docs.reduce((acc, { debt }) => {
          return (
            acc +
            debt.reduce((a, doc) => {
              if (doc.type === "in") a = a + doc.amount;
              if (doc.type === "out") a = a - doc.amount;
              return a;
            }, 0)
          );
        }, 0);
        setbalance(total);
        setCustomers(docs);
      })
      .catch(console.log);
  }, [update]);

  return (
    <Layout>
      <h3>Customers</h3>
      <p>Total &#x20A6; {balance}</p>
      <List>
        {customers.map((c) => (
          <CustomerItem c={c} key={c._id} updateState={setUpdate} />
        ))}
      </List>
      <p>Create New Customer</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="name">
            Enter customer's name
          </label>
          <input type="text" name="name" id="name" />
        </div>
        <div>
          <div className="label">Mobile Number</div>
          <PhoneInput
            country={"us"}
            value={phone}
            onChange={(e) => setPhone(e)}
          />
        </div>
        <div>
          <span>
            <button className="btn" type="submit">
              Save
            </button>
          </span>
        </div>
      </form>
    </Layout>
  );
}

function CreateDebt({ customer, setUpdate, closeTransaction }) {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  function handleDebt(e) {
    e.preventDefault();
    const state = Object.fromEntries(new FormData(e.target));
    console.log(state);
    // axios
    //   .post("/api/debt", {
    //     ...state,
    //     amount: parseFloat(state.amount),
    //     customer: customer._id,
    //     date: new Date(new Date(state.due).setHours(0, 0, 0, 0)).getTime(),
    //   })
    //   .then(({ data: { doc } }) => {
    //     setUpdate((u) => ({ ...u, type: "get" }));
    //     closeTransaction();
    //   })
    //   .catch(console.log);
  }
  return (
    <form onSubmit={handleDebt}>
      {/* <div>
        <label htmlFor="type" className="label"></label>
        <select name="type" id="type">
          <optgroup label="Choose Transaction type">
            <option value="in">Credit</option>
            <option value="out">Debit</option>
          </optgroup>
        </select>
      </div>
      
      <div>
        <label className="label" htmlFor="due">
          Due in
        </label>
        <input type="date" name="due" id="due" />
      </div>*/}
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          // value={age}
          // onChange={handleChange}
        >
          <MenuItem value="in">Credit</MenuItem>
          <MenuItem value="out">Debit</MenuItem>
        </Select>
        <FormHelperText>Select type of transaction</FormHelperText>
      </FormControl>
      <div>
        <label className="label" htmlFor="item">
          Items Bought
        </label>
        <input type="text" name="item" id="items" />
      </div>
      <div>
        <label className="label" htmlFor="amount">
          Amount
        </label>
        <input type="number" name="amount" id="amount" />
      </div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Date picker inline"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>

      <div>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </div>
    </form>
  );
}

function CustomerItem({ c, updateState }) {
  const [showTransaction, setShowTransaction] = useState(false);

  return (
    <>
      <ListItem button>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={c.name} secondary="Jan 9, 2014" />
        <Button
          onClick={() => setShowTransaction(!showTransaction)}
          variant="contained"
          color="primary"
        >
          Record Debt
        </Button>
      </ListItem>
      {showTransaction && (
        <CreateDebt
          customer={c}
          setUpdate={updateState}
          closeTransaction={() => setShowTransaction(!showTransaction)}
        />
      )}
    </>
  );
}

{
  /* <p>
        <Link href={`/customers/${c._id}`}>
          <a>
            <span>{c.name} - </span>
            <span>{c.phone}</span>
          </a>
        </Link>
      </p>
      <p>
        
      </p>
      <div>
        
      </div> */
}
