const express = require("express");
const cartRoutes = express.Router();
const pool = require("./connection");

cartRoutes.get("/cart-items", (req, res) => {
  let sql = "SELECT * FROM shopping_cart";
  pool.query(sql).then(result => {
    res.json(result.rows);
  }); //make query then send result translate into json. or jut res.send if not json
});
//fill table in with sample data so you can see it working
cartRoutes.get("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let sql = "SELECT * FROM shopping_cart WHERE id = $1::int";
  let params = [id];
  pool.query(sql, params).then(result => {
    if (result.rows.length !== 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404);
      res.send("no such item");
    }
  });
});

cartRoutes.post("/cart-items", (req, res) => {
  const aItem = req.body;
  let sql = `INSERT INTO shopping_cart (product, price, quantity)
  VALUES ($1::TEXT , $2::INT , $3::INT) RETURNING *`;
  let params = [aItem.product, aItem.price, aItem.quantity];
  pool.query(sql, params).then(result => {
    res.status(201);
    res.json(result.rows[0]);
  });
});

cartRoutes.put("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = req.body;
  let sql = `UPDATE shopping_cart SET product=$1::text, price=$2::INT, quantity=$3::INT WHERE id =$4::INT RETURNING *`;
  let params = [item.product, item.price, item.quantity, id];
  pool.query(sql, params).then(result => {
    res.json(result.rows[0]);
  });
});

cartRoutes.delete("/cart-items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let sql = `DELETE FROM shopping_cart WHERE id=$1::INT`;
  let params = [id];
  pool.query(sql, params).then(result => {
    res.sendStatus(204); //sendStatus combines send and status
  });
});

// routes.delete("/animals/:id", function(req, res) {
//     pool.query("delete from Animals where id=$1::int", [req.params.id]).then(() => {
//     getTable(req, res);
//     });
//     });

// routes.put("/animals/:id", function(req, res) {
//     pool.query("update Animals set name=$1::text where id=$2::int",
//     [req.body.name, req.params.id]).then(() => {
//     getTable(req, res);
//     });
//     });

// cartRoutes.delete("/cart-items/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = cart.findIndex(i => i.id === id);
//   if (index !== -1) {
//     cart.splice(index, 1);
//   }

//   res.sendStatus(204);
// });

module.exports = cartRoutes;
