"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/app.ts
var import_cookie = __toESM(require("@fastify/cookie"));
var import_fastify = __toESM(require("fastify"));

// src/routes/transactions.ts
var import_node_crypto = __toESM(require("crypto"));
var import_zod2 = require("zod");

// src/database.ts
var import_knex = require("knex");

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV !== "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)({ path: "" });
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: import_zod.z.string(),
  PORT: import_zod.z.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.log("Invalid environment variables!", _env.error.format());
  throw new Error("Invalid environment variables!");
}
var env = _env.data;

// src/database.ts
var config2 = {
  client: "sqlite",
  useNullAsDefault: true,
  connection: {
    filename: env.DATABASE_URL
  },
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);

// src/middlewares/check-session-id-exists.ts
function checkSessionIdExists(request, reply) {
  return __async(this, null, function* () {
    const sessionId = request.cookies.sessionId;
    if (!sessionId) {
      return reply.status(401).send({
        erro: "Unauthorized"
      });
    }
  });
}

// src/routes/transactions.ts
function transactionsRoutes(app2) {
  return __async(this, null, function* () {
    app2.get("/", {
      preHandler: [checkSessionIdExists]
    }, (request, reply) => __async(null, null, function* () {
      const { sessionId } = request.cookies;
      const transactions = yield knex("transactions").where("session_id", sessionId).select();
      return {
        transactions
      };
    }));
    app2.get("/:id", {
      preHandler: [checkSessionIdExists]
    }, (request) => __async(null, null, function* () {
      const getTransactionParamsSchema = import_zod2.z.object({
        id: import_zod2.z.string().uuid()
      });
      const { id } = getTransactionParamsSchema.parse(request.params);
      const { sessionId } = request.cookies;
      const transaction = yield knex("transactions").where({
        session_id: sessionId,
        id
      }).first();
      return {
        transaction
      };
    }));
    app2.post("/", (request, reply) => __async(null, null, function* () {
      const createTransactionBodySchema = import_zod2.z.object({
        title: import_zod2.z.string(),
        amount: import_zod2.z.number(),
        type: import_zod2.z.enum(["credit", "debit"])
      });
      const {
        title,
        amount,
        type
      } = createTransactionBodySchema.parse(request.body);
      let sessionId = request.cookies.sessionId;
      if (!sessionId) {
        sessionId = (0, import_node_crypto.randomUUID)();
        reply.cookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7
          // 7 days
        });
      }
      yield knex("transactions").insert({
        id: import_node_crypto.default.randomUUID(),
        title,
        amount: type === "credit" ? amount : amount * -1,
        session_id: sessionId
      });
      return reply.status(201).send();
    }));
    app2.get("/summary", {
      preHandler: [checkSessionIdExists]
    }, (request) => __async(null, null, function* () {
      const { sessionId } = request.cookies;
      const summary = yield knex("transactions").where("session_id", sessionId).sum("amount", { as: "amount" }).first();
      return {
        summary
      };
    }));
  });
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(import_cookie.default);
app.register(transactionsRoutes, {
  prefix: "transactions"
});

// src/server.ts
app.listen({
  port: env.PORT
}).then(() => {
  console.log("HTTP Server Running!");
});
