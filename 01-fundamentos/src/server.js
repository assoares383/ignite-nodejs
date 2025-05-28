import http from "node:http";

import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

// Query Parameters: URL Statefull => Filtros, paginacao, nao-obrigatorios
// Route Paramters: Identificacao de recursos
// Request Body: Envio de informacoes de um formulario (HTTPs)

// http://localhost:3333/users?userId:1&name=Teste

// GET http://localhost:3333/users/1
// DELETE http://localhost:3333/users/1
// POST http://localhost:3333/users

// Edicao e remocao

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    console.log(extractQueryParams(routeParams.groups.query));

    const { query, ...params } = routeParams.groups;

    req.params = params;
    res.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(3333);
