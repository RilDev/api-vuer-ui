test("basic 2 + 2 = 4", () => {
  expect(2 + 2).toBe(4);
});

test("object assigment", () => {
  const obj = { one: 1 };
  obj["two"] = 2;
  expect(obj).toEqual({ one: 1, two: 2 });
});
