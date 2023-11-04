import { NextApiHandler } from "next";
import { StaticImageData } from "next/image";
import portrait from "@/images/portrait.jpg";

export interface UserConfigItem {
  name: string;
  email: string;
  avatar: StaticImageData | string;
}

const firstNames = ["John", "Julian", "Jane", "Joshua", "Fred"];
const lastNames = ["Walton", "Freeson", "Merrick", "Louis", "Pharris"];

function generateUser(index: number) {
  const index1 = Math.floor(Math.random() * firstNames.length);
  const index2 = Math.floor(Math.random() * lastNames.length);

  const name = `${firstNames[index1]} ${lastNames[index2]}`;
  const email = `${index}@gmail.com`;

  return {
    name,
    email,
    avatar: portrait
  }
}

const handler: NextApiHandler = (req, res) => {
  const { admins } = req.query;
  const showOnlyAdmins = admins === "true"

  const userConfig: UserConfigItem[] = [...Array(showOnlyAdmins ? 8 : 10 ** 3)].map((_, index) => generateUser(index));

  return res.status(200).json({ userConfig })
}

export default handler;