import mysql from "mysql";
import { handleError } from "./utils";

const db = mysql.createConnection({
  host: "remotemysql.com",
  user: "ekjA9vCRo2",
  password: "CpTfZ8ck8Y",
  database: "ekjA9vCRo2"
});

db.connection = function() {
  this.connect(err => {
    if (err) {
      throw err;
    }
    console.log("---Connected to database---");
  });
};

db.getAll = (tableName, Model) => {
  return (req, res) => {
    db.query(`SELECT * FROM ${tableName}`, (err, rows) => {
      if (err) handleError(err, res);
      else {
        let items = [];
        rows.forEach(row => {
          items.push(new Model(row));
        });
        res.send(items);
      }
    });
  };
};

db.create = (tableName, values, Model) => {
  return (req, res) => {
    let object = new Model(req.body);
    let insertInto = values.join(",");
    values.forEach(function(value, index) {
      this[index] = object[value];
    }, values);
    let placeholders = values.map(val => "?").join(",");
    let query = `INSERT INTO ${tableName} (${insertInto}) VALUES (${placeholders})`;
    db.query(query, values, err => {
      if (err) {
        handleError(err, res);
      } else res.send(`${tableName} inserted successfuly`);
    });
  };
};

db.get = (tableName, Model) => {
  return (req, res) => {
    let id = req.params.id;
    db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (err, row) => {
      if (err) {
        handleError(err, res);
      } else {
        let result =
          row === undefined || row.length == 0 ? {} : new Model(row[0]);
        res.send(result);
      }
    });
  };
};

db.update = (tableName, values, Model) => {
  return (req, res) => {
    let exit = 0;
    const id = req.params.id;
    db.query(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id],
      (err, currentRow) => {
        if (err) {
          handleError(err, res);
        } else {
          currentRow =
            currentRow === undefined || currentRow.length == 0
              ? {}
              : new Model(currentRow[0]);
          console.log(currentRow);
          const currentModel =
            currentRow === undefined || currentRow.length == 0
              ? {}
              : new Model(currentRow);
          console.log(currentModel);
          Object.keys(req.body).forEach(key => {
            if (key in currentModel) {
              currentModel[key] = req.body[key];
            } else {
              handleError(new Error("Tried to update undefined property"), res);
              exit = 1;
            }
          });
          if (exit == 1) {
            return;
          }
          let objectValues = [];
          values.forEach(function(value, index) {
            objectValues.push(currentModel[value]);
            this[index] = `${value} = ?`;
          }, values);
          values = values.join(",");
          const query = `UPDATE ${tableName} SET ${values} WHERE id = ${id}`;
          db.query(query, objectValues, err => {
            if (err) {
              handleError(err, res);
            } else res.send(`${tableName} updated successfuly`);
          });
        }
      }
    );
  };
};

db.remove = tableName => {
  return (req, res) => {
    db.query(`DELETE FROM ${tableName} WHERE id = ${req.params.id}`, err => {
      if (err) {
        handleError(err, res);
      } else res.send(`Record from ${tableName} deleted successfuly`);
    });
  };
};

db.createControllerMethods = (tableName, Model, createValues, updateValues) => {
  const getAll = db.getAll(tableName, Model);
  const create = db.create(tableName, createValues, Model);
  const get = db.get(tableName, Model);
  const update = db.update(tableName, updateValues, Model);
  const remove = db.remove(tableName);
  return { getAll, get, create, update, remove };
};

export default db;
