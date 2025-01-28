import { MongoClient } from "mongodb" ;

const url = 'mongbdb://elia:admin@localhost:27017';
const client = new MongoClient (url);
const dbName ='S18-movie-raclette';

export const db = client .db(dbName);
export const dbconnect = async () => {

await client.connect();
console. log( 'Connected successfully to server');
}