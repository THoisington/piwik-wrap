"use strict";

import expect from "unexpected";
import * as DOM from "../DOM";
import * as AssetsServer from "../AssetsServer";

import getPiwikScript from "../../src/lib/getPiwikScript";

describe("getPiwikScript", () => {
    const port = 3033;
    const url = `http://localhost:${port}`;
    let script;

    before(() => DOM.create());

    describe("- script properties:", () => {

        before(() => script = getPiwikScript(url, () => {}, () => {}));

        describe("type", () => {
            it("should have a property type with value \"text/javascript\"", () => {
                expect(script, "to have property", "type");
                expect(script.type, "to equal", "text/javascript")
            });
        });

        describe("defer", () => {
            it("should have a property defer set to true", () => {
                expect(script, "to have property", "defer");
                expect(script.defer, "to be truthy");
            });
        });

        describe("async", () => {
            it("should have a property async set to true", () => {
                expect(script, "to have property", "async");
                expect(script.async, "to be truthy");
            });
        });
    });

    describe("- script callbacks", () => {

        before((done) => AssetsServer.start(port, done));

        describe("onload", () => {
            it("should execute given callback \"onload\"", (done) => {
                document.body.appendChild(getPiwikScript(url, done, done));
            });
        });

        describe("onerror", () => {
            it("should execute given callback \"onerror\" and pass an instance of URIError", (done) => {
                document.body.appendChild(
                    getPiwikScript(
                        url.replace(`:${port}`, ""),
                        () => done(new Error("Test Failed!")),
                        (err) => {
                            expect(err, "to be a", URIError);
                            done();
                        }
                    )
                );
            });
        });

        after((done) => AssetsServer.stop(done));
    });

    after(() => DOM.destroy());
});