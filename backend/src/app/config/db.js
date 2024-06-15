import mysql from "mysql2/promise";

export async function query({ query, values = [] }) {

  const dbconnection = await mysql.createConnection({
    host: "127.0.0.1",
    port: "3306",
    database: "Digital_Solution",
    user: "root",
    password: "",
  });

  try {
    const [results] = await dbconnection.execute(query, values);
    dbconnection.end();
    console.log("Connected to Database");
    return results;
  } catch (error) {
    throw Error(error.message);
    console.error("Error connecting to MySQL Database: ",err);
    return { error };
  }
}