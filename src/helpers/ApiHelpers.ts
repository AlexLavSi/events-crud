import {randomBytes} from "crypto";

export const generateEntityId = () => {
    return randomBytes(16).toString("hex");
};