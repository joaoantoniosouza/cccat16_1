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
  expect(outputGetAccount.isPassenger).toBe(true);
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
