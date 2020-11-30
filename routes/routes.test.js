process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");


let yogurt;

beforeEach(function () {
  yogurt = { name: "yogurt", price: "3.59" };
  items.push(yogurt);
  console.log("BEFORE: ", items);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `items`
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ items: [yogurt] })
  });
})

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${yogurt.name}`);
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ item: yogurt })
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/poprocks`);
    expect(res.statusCode).toBe(404)
  });
})

describe("POST /items", () => {
  test("Creating an item", async () => {
    const res = await request(app).post("/items").send({ name: "mustard", price: "2.39" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "mustard", price: "2.39" } });
  });
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({ price: "4.99" });
    expect(res.statusCode).toBe(400);
  });
  test("Responds with 400 if price is missing", async () => {
    const res = await request(app).post("/items").send({ name: "bread" });
    expect(res.statusCode).toBe(400);
  });
});

describe("/PATCH /items/:name", () => {
  test("Updating an item's name", async () => {
    console.log("BEFORE PATCH name: ", items);
    const res = await request(app).patch(`/items/${yogurt.name}`).send({ name: "apple" });
    console.log("AFTER PATCH name: ", items);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "apple", price: "3.59" } });
  });
  test("Updating an item's price", async () => {
    console.log("BEFORE PATCH price: ", items);
    const res = await request(app).patch(`/items/${yogurt.name}`).send({ price: ".99" });
    console.log("AFTER PATCH price: ", items);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "yogurt", price: ".99" } });
  });
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch("/items/yoggurt").send({ name: "apple" });
    expect(res.statusCode).toBe(404);
  });
})

describe("/DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/${yogurt.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' })
  })
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/beef`);
    expect(res.statusCode).toBe(404);
  })
})