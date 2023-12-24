const nock = require("nock");
const got = require("got");
const expect = require("chai").expect;
const { ping } = require("./ping");
const host = "https://todo-app-barkend-b18308c4c059.herokuapp.com/todos/";

describe("todo-app-barkend mocked tests", () => {
  beforeAll(async () => {
    await ping(host)
      .then((res) => console.log(res))
      .catch((e) => console.log(e + `Restart server on heroku ${host}`));
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("can get todos", async () => {
    const todoObject = {
      todos: [
        { task: "Two", _id: 9, completed: false },
        { task: "three", _id: 84, completed: false },
      ],
    };
    nock(host).get("/").reply(200, todoObject);
    const res = await got(host);
    expect(res.body).to.eq(JSON.stringify(todoObject));
    expect(res.statusCode).to.equal(200);
  });

  it("can create todos", async () => {
    const createdTodo = {
      todos: [{ task: "Cook Dinner Today", _id: 9, completed: false }],
    };
    nock(host).post("/").reply(200, createdTodo);
    const res = await got.post(host, { task: "Cook Breakfast" });
    expect(res.body).to.eq(JSON.stringify(createdTodo));
    expect(res.statusCode).to.equal(200);
  });
});

describe("todo-app-barkend - tests without mocks", () => {
  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("can create todos - enabled backend", async () => {
    var options = {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        task: "Cook Lunch",
      }),
    };

    await nock.enableNetConnect(/(todo-app-barkend)\.herokuapp.com/);
    const res = await got.post(host, options);
    expect(JSON.parse(res.body)).to.have.property("task", "Cook Lunch");
  });
});
