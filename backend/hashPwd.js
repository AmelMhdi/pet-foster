import { hash } from "argon2";

const mdpAnya = async () => {
    const plainPwd = "hashed_pwd_1"; // mdp de Anya
    console.log("Plain password Anya:", plainPwd);
    const AnyaHashedPwd = await hash(plainPwd);
    console.log("Hashed password Anya:", AnyaHashedPwd);
}

mdpAnya();

const mdpJoon = async () => {
    const plainPwd = "hashed_pwd_2"; // mdp de Joon
    console.log("Plain password Joon:", plainPwd);
    const JoonHashedPwd = await hash(plainPwd);
    console.log("Hashed password Joon:", JoonHashedPwd);
}

mdpJoon();