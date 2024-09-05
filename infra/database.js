import { Client } from "pg";

async function query(queryOject) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryOject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query,
  getNewClient,
};

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  await client.connect();
  return client;
}

function getSSLValues() {
  if (process.env.POSTEGRES_CA) {
    return {
      rejectUnauthorized: false,
    };
  }
  return false;
}
