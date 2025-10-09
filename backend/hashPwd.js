import { hash } from "argon2";

const mdpAnya = async () => {
    const plainPwd = "hashed_pwd_1"; // mdp de Anya
    const hashedPwd = await hash(plainPwd);
    console.log("Hashed password:", hashedPwd);
}

mdpAnya();

const mdpJoon = async () => {
    const plainPwd = "hashed_pwd_2"; // mdp de Joon
    const hashedPwd = await hash(plainPwd);
    console.log("Hashed password:", hashedPwd);
}

mdpJoon();