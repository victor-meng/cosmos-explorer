import { isInvalidParentFrameOrigin, isReadyMessage } from "./MessageValidation";

describe("isInvalidParentFrameOrigin", () => {
  test.each`
    domain                                                           | expected
    ${"https://cosmos.azure.com"}                                    | ${false}
    ${"https://cosmos.azure.us"}                                     | ${false}
    ${"https://cosmos.azure.cn"}                                     | ${false}
    ${"https://portal.azure.com"}                                    | ${false}
    ${"https://portal.azure.us"}                                     | ${false}
    ${"https://portal.azure.cn"}                                     | ${false}
    ${"https://portal.microsoftazure.de"}                            | ${false}
    ${"https://subdomain.portal.azure.com"}                          | ${false}
    ${"https://subdomain.portal.azure.us"}                           | ${false}
    ${"https://subdomain.portal.azure.cn"}                           | ${false}
    ${"https://main.documentdb.ext.azure.com"}                       | ${false}
    ${"https://main.documentdb.ext.azure.us"}                        | ${false}
    ${"https://main.documentdb.ext.azure.cn"}                        | ${false}
    ${"https://main.documentdb.ext.microsoftazure.de"}               | ${false}
    ${"https://random.domain"}                                       | ${true}
    ${"https://malicious.cloudapp.azure.com"}                        | ${true}
    ${"https://malicious.germanycentral.cloudapp.microsoftazure.de"} | ${true}
    ${"https://maliciousazure.com"}                                  | ${true}
    ${"https://maliciousportalsazure.com"}                           | ${true}
  `("returns $expected when called with $domain", ({ domain, expected }) => {
    expect(isInvalidParentFrameOrigin({ origin: domain } as MessageEvent)).toBe(expected);
  });
});

describe("isReadyMessage", () => {
  test.each`
    event                                                 | expected
    ${{ data: { kind: "ready" } }}                        | ${true}
    ${{ data: { data: "ready" } }}                        | ${true}
    ${{ data: { data: "ready", kind: "ready" } }}         | ${true}
    ${{ data: { kind: "not-ready" } }}                    | ${false}
    ${{ data: { data: "not-ready" } }}                    | ${false}
    ${{ data: { data: "not-ready", kind: "not-ready" } }} | ${false}
    ${{ data: {} }}                                       | ${false}
    ${{}}                                                 | ${false}
  `("returns $expected when called with $event", ({ event, expected }) => {
    expect(isReadyMessage(event as MessageEvent)).toBe(expected);
  });
});
