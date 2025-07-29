import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
};

test("Deve criar uma conta para o passageiro", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    input
  );
  expect(responseSignup.status).toBe(200);
  const outputSignup = responseSignup.data;
  expect(outputSignup.accountId).toBeDefined();
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${responseSignup.data.accountId}`
  );
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.is_passenger).toBe(true);
});

test("Deve criar uma conta para o driver", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    carPlate: "AAA9999",
    isPassenger: false,
    isDriver: true,
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    input
  );
  expect(responseSignup.status).toBe(200);
  const outputSignup = responseSignup.data;
  expect(outputSignup.accountId).toBeDefined();
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${responseSignup.data.accountId}`
  );
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.car_plate).toBe(input.carPlate);
  expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
  expect(outputGetAccount.is_driver).toBe(input.isDriver);
});

test("Não deve criar uma conta para o passageiro se o nome for inválido", async function () {
  const input = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    carPlate: "AAA9999",
    isPassenger: false,
    isDriver: true,
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    input
  );
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe("Invalid name");
});

test("Não deve criar uma conta para o passageiro se o email for inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}`,
    cpf: "87748248800",
    carPlate: "AAA9999",
    isPassenger: false,
    isDriver: true,
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    input
  );
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe("Invalid email");
});

test("Não deve criar uma conta para o passageiro se o cpf for inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "877482400",
    carPlate: "AAA9999",
    isPassenger: false,
    isDriver: true,
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    input
  );
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe("Invalid CPF");
});

test("Não deve criar uma conta para o motorista se a placa for inválida", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    carPlate: "99",
    isPassenger: false,
    isDriver: true,
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    input
  );
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe("Invalid car plate");
});

test("Não deve criar uma conta para o passageiro se o email já existe", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
  };
  await axios.post("http://localhost:3000/signup", input);
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    input
  );
  expect(responseSignup.status).toBe(422);
  const outputSignup = responseSignup.data;
  expect(outputSignup.message).toBe("Account already exists");
});
