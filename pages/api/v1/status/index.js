/*import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;
  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    update_at: updateAt,
    dependecies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;*/
import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  // Consulta para obter a versão do banco de dados Oracle
  const databaseVersionResult = await database.query({
    sql: "SELECT * FROM v$version WHERE banner LIKE 'Oracle%';",
  });
  const databaseVersionValue = databaseVersionResult.rows[0].BANNER;

  // Consulta para obter o máximo de conexões permitidas no Oracle (limite de sessões)
  const databaseMaxConnectionsResult = await database.query({
    sql: `SELECT value FROM v$parameter WHERE name = 'sessions';`,
  });
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].VALUE;

  // Consulta para contar o número de conexões ativas
  const databaseOpenedConnectionsResult = await database.query({
    sql: "SELECT COUNT(*) AS count FROM v$session WHERE status = 'ACTIVE';",
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].COUNT;

  response.status(200).json({
    update_at: updateAt,
    dependecies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
