import request from "supertest";
import app from "../src/app";

let existedEntityId = "";

describe("POST /entity", () => {
    it("should return 200 OK", (done) => {
        return request(app).post("/entity")
            .send({name: "test-event"})
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                existedEntityId = (res.body.id);
                done();
            });
    });

    it("should return 400", (done) => {
        return request(app).post("/entity")
            .expect("Content-Type", /json/)
            .expect(400)
            .end(() => done());
    });
});

describe("PUT /entity", () => {
    it("should return 404", () => {
        return request(app).put("/entity/" + "someid213213")
            .send({name: "other-event"})
            .expect("Content-Type", /json/)
            .expect(404);
    });
    it("should return 400", () => {
        return request(app).put("/entity/" + existedEntityId)
            .expect("Content-Type", /json/)
            .expect(400);
    });
    it("should return 200 OK", () => {return request(app).put("/entity/" + existedEntityId)
            .send({name: "other-event"})
            .expect("Content-Type", /json/)
            .expect(200);
    });
});

describe("DELETE /entity", () => {
    it("should return 404 OK", () => {
        return request(app).delete("/entity/" + "someid213213")
            .expect("Content-Type", /json/)
            .expect(404);
    });
    it("should return 200 OK", () => {
        return request(app).delete("/entity/" + existedEntityId)
            .expect("Content-Type", /json/)
            .expect(200);
    });
});