import { Client } from "https://deno.land/x/mysql/mod.ts";

// config.ts

import {DATABASE, TABLE} from './config.ts'

const client = await new Client();

client.connect({
    hostname: '127.0.0.1',
    port:3306,
    username: 'root',
    password: '',
    db: ''
})


const run = async () => {
    // create database (if not created before)
    await client.execute(`CREATE DATABASE IF NOT EXISTS ${DATABASE}`);
    // select db
    await client.execute(`USE ${DATABASE}`);

    // delete table if it exists before
    // await client.execute(`DROP TABLE IF EXISTS ${TABLE.TODO}`);
    // create table
    
};

run();

export default client;