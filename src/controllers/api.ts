import { Response, Request } from "express";
import { EntityDocument, EntityStore } from "../models/Entity";
import { generateEntityId } from "../helpers/ApiHelpers";
import { EventEmitter } from "events";
import { validate } from "joi";
import { entityScheme } from "../validateSchemes/Entity";

const Stream = new EventEmitter();
let db: EntityStore[] = [];

export const createEntity = async (req: Request, res: Response) => {
    const entity = req.body as EntityDocument;
    try {
        await validate(entity, entityScheme);
    }catch (e) {
        return res.status(400).json({ message: e.message });
    }
    const newEntityId = generateEntityId();
    const newEntity = {
        id: newEntityId,
        name: entity.name
    };
    db.push(newEntity);
    /** Push action to events stream */
    Stream.emit("push","Created", newEntity);
    res.status(200).json({ message: `Entity is inserted, id is: ${newEntityId}`, id: newEntityId});
};

export const updateEntity = async (req: Request, res: Response) => {
    const entityId = req.params.id;
    const newEntity = req.body as EntityDocument;
    try {
        await validate(newEntity, entityScheme);
    }catch (e) {
        return res.status(400).json({ message: e.message });
    }
    const existedEntity = db.find((el: EntityStore) => el.id === entityId);
    let updatedEntity = {};

    if (!existedEntity) {
        return res.status(404).json({ message: "Entity not found" });
    }

    db.map((el: EntityStore) => {
        if (el.id === entityId) {
            el.name = newEntity.name;
            updatedEntity = el;
        }
        return el;
    });
    /** Push action to events stream */
    Stream.emit("push","Updated", updatedEntity);
    res.status(200).json({ message: `Entity ${entityId} is updated` });
};

export const deleteEntity = (req: Request, res: Response) => {
    const entityId = req.params.id;
    const existedEntity = db.find((el: EntityStore) => el.id === entityId);

    if (!existedEntity) {
        return res.status(404).json({ message: "Entity not found" });
    }

    db = db.filter((el: EntityStore) => el.id !== entityId);
    /** Push action to events stream */
    Stream.emit("push","Deleted", existedEntity);
    res.status(200).json({ message: `Entity ${entityId} is deleted` });
};

export const sseStream = (req: Request, res: Response) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });

    Stream.on("push", (type, data) => {
        res.write(`data: {"type":${type},"entity":{"name":"${data.name}","id":"${data.id}"}}` + "\n\n");
    });

    // If client closes connection, stop sending events
    res.on("close", () => {
        console.log("client dropped me");
        res.end();
    });
};