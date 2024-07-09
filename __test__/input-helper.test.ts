/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */
import * as core from "@actions/core"
import * as github from "@actions/github"
import * as inputHelper from "../src/input-helper"
import { ActionInputs } from "../src/action-inputs"
import { INPUT_BRANCH } from "../src/constants"

// Inputs for mock @actions/core
/* eslint-disable  @typescript-eslint/no-explicit-any */
let inputs = {} as any

// Shallow clone original @actions/github context
const originalContext = { ...github.context }

describe("input-helper tests", () => {
    beforeAll(() => {
        // Mock getInput
        jest.spyOn(core, "getInput").mockImplementation((name: string) => {
            return inputs[name]
        })

        // Mock error/warning/info/debug
        jest.spyOn(core, "error").mockImplementation(jest.fn())
        jest.spyOn(core, "warning").mockImplementation(jest.fn())
        jest.spyOn(core, "info").mockImplementation(jest.fn())
        jest.spyOn(core, "debug").mockImplementation(jest.fn())

        // Mock github context
        jest.spyOn(github.context, "repo", "get").mockImplementation(() => {
            return {
                owner: "some-owner",
                repo: "some-repo",
            }
        })
        github.context.ref = "refs/heads/some-refs"
    })

    beforeEach(() => {
        // Reset inputs
        inputs = {}
    })

    afterAll(() => {
        // Restore @actions/github context
        github.context.ref = originalContext.ref
        github.context.sha = originalContext.sha

        // Restore
        jest.restoreAllMocks()
    })

    it("sets defaults", () => {
        const actionInputs: ActionInputs = inputHelper.getInputs()
        expect(actionInputs).toBeTruthy()
        expect(actionInputs.authToken).toBeFalsy()
        expect(actionInputs.branch).toBeTruthy()
        expect(actionInputs.seconds).toBeFalsy()
    })

    it("unqualifies head ref", () => {
        const originalRef = github.context.ref
        try {
            github.context.ref = "refs/heads/some-qualified-ref"
            const actionInputs: ActionInputs = inputHelper.getInputs()
            expect(actionInputs).toBeTruthy()
            expect(actionInputs.branch).toBe("some-qualified-ref")
        } finally {
            github.context.ref = originalRef
        }
    })

    it("does not allow tags ref", () => {
        const originalRef = github.context.ref
        try {
            github.context.ref = "refs/tags/some-tag"
            const t = () => {
                inputHelper.getInputs()
            }
            expect(t).toThrow()
        } finally {
            github.context.ref = originalRef
        }
    })

    it("input branch overrides default branch", () => {
        inputs[INPUT_BRANCH] = "some-branch"
        const actionInputs: ActionInputs = inputHelper.getInputs()
        expect(actionInputs.branch).toBe("some-branch")
    })
})
