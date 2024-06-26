import { PrismaClient } from "@prisma/client";
import * as Bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.createMany({
    data: [
      {
        code: "ADMIN",
        title: "Administrador",
        description: "Acesso total aos dados",
      },
      {
        code: "USER",
        title: "Usuário",
        description: "Acessa apenas seus próprios dados",
      },
    ],
  });

  const userUser = await prisma.user.create({
    data: {
      roleCode: "USER",
      firstName: "João",
      lastName: "José",
      email: "exemplo@gmail.com",
      password: await Bcrypt.hash("12qwaszx", 10),
      company: "IFood",
      phone: "(27) 99743-6789",
    },
  });

  const userAdmin = await prisma.user.create({
    data: {
      roleCode: "ADMIN",
      firstName: "Leonardo",
      lastName: "Sarmento",
      email: "lsarmento@findes.org.br",
      password: await Bcrypt.hash("12qwaszx", 10),
      company: "Google",
      phone: "(27) 99935-1234",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
