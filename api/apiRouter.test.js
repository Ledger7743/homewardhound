// const { server, handle } = require();

// require("dotenv").config();
// const request = require("supertest");
// require("../../db/client");
// const app = require("../../app");

// describe("/api/health", () => {
//   it("responds to a request at /api/health with a message specifying it is healthy", async (done) => {
//     const response = await request(app).get("/api/health");
//     expect(response.status).toEqual(200);
//     expect(typeof response.body.message).toEqual("string");
//     done();
//   });
// });

const { server, handle } = require("../index");
const { client } = require("../db");
const supertest = require("supertest");
const request = supertest(server);

describe("/api/health endpoint", () => {
  // close db connection and supertest server tcp connection
  afterAll(async () => {
    await client.end();
    handle.close();
  });

  it("should respond with { healthy: true }", async () => {
    const response = await request.get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.healthy).toBe(true);
  });
});
