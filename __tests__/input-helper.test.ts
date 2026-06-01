import { jest } from "@jest/globals"
import type { ActionInputs } from "../src/action-inputs.js"
import { INPUT_BRANCH } from "../src/constants.js"

const inputs: Record<string, string> = {}
const mockDebug = jest.fn()
const mockGetInput = jest.fn((name: string) => inputs[name] ?? "")
const mockContext = {
    ref: "refs/heads/some-refs",
    repo: {
        owner: "some-owner",
        repo: "some-repo",
    },
}

await jest.unstable_mockModule("@actions/core", () => ({
    debug: mockDebug,
    error: jest.fn(),
    getInput: mockGetInput,
    info: jest.fn(),
    warning: jest.fn(),
}))

await jest.unstable_mockModule("@actions/github", () => ({
    context: mockContext,
}))

const inputHelper = await import("../src/input-helper.js")

describe("input-helper tests", () => {
    beforeEach(() => {
        for (const key of Object.keys(inputs)) {
            delete inputs[key]
        }

        inputs.seconds = "86400"
        mockContext.ref = "refs/heads/some-refs"
        mockDebug.mockClear()
        mockGetInput.mockClear()
    })

    it("sets defaults", () => {
        const actionInputs: ActionInputs = inputHelper.getInputs()
        expect(actionInputs).toBeTruthy()
        expect(actionInputs.authToken).toBeFalsy()
        expect(actionInputs.branch).toBeTruthy()
        expect(actionInputs.seconds).toBe(86400)
    })

    it("unqualifies head ref", () => {
        mockContext.ref = "refs/heads/some-qualified-ref"
        const actionInputs: ActionInputs = inputHelper.getInputs()
        expect(actionInputs).toBeTruthy()
        expect(actionInputs.branch).toBe("some-qualified-ref")
    })

    it("does not allow tags ref", () => {
        mockContext.ref = "refs/tags/some-tag"
        expect(() => {
            inputHelper.getInputs()
        }).toThrow()
    })

    it("input branch overrides default branch", () => {
        inputs[INPUT_BRANCH] = "some-branch"
        const actionInputs: ActionInputs = inputHelper.getInputs()
        expect(actionInputs.branch).toBe("some-branch")
    })

    it("does not allow invalid seconds input", () => {
        inputs.seconds = "not-a-number"
        expect(() => {
            inputHelper.getInputs()
        }).toThrow("seconds value must be a non-negative integer")
    })
})
