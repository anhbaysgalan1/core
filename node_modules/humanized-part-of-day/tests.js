const assert = require("assert");
const sinon = require("sinon");
const humanizedPartOfDay = require("./index.js");

let clock;

beforeEach(() => {
  clock = sinon.useFakeTimers();
});

afterEach(() => {
  clock.restore();
});

describe("Current part of day", () => {
  it("should return \"MORNING\" when currentHour is between 5 and 12", () => {
    clock.tick("06:00:00");

    assert.equal(humanizedPartOfDay.getCurrent(), "MORNING");
  });

  it("should return \"AFTERNOON\" when currentHour is between 12 and 18", () => {
    clock.tick("13:00:00");

    assert.equal(humanizedPartOfDay.getCurrent(), "AFTERNOON");
  });

  it("should return \"EVENING\" when currentHour is greater than 18", () => {
    clock.tick("22:00:00");

    assert.equal(humanizedPartOfDay.getCurrent(), "EVENING");
  });

  it("should return \"EVENING\" when currentHour is lower than 5", () => {
    clock.tick("03:00:00");

    assert.equal(humanizedPartOfDay.getCurrent(), "EVENING");
  });
});

