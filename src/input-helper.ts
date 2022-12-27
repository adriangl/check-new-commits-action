import * as core from "@actions/core"
import * as github from "@actions/github"
import { ActionInputs } from "./action-inputs"
import {
    INPUT_TOKEN,
    INPUT_SECONDS,
    INPUT_BRANCH,
    REF_HEADS_PREFIX,
    REF_TAGS_PREFIX,
} from "./constants"

export function getInputs(): ActionInputs {
    const result = {} as unknown as ActionInputs

    result.authToken = getAuthToken()
    result.seconds = getSeconds()
    result.branch = getBranch()

    return result
}

function getAuthToken(): string {
    return core.getInput(INPUT_TOKEN)
}

function getSeconds(): number {
    return parseInt(core.getInput(INPUT_SECONDS))
}

function getBranch(): string {
    let branch = core.getInput(INPUT_BRANCH) || github.context.ref

    if (branch.startsWith(REF_TAGS_PREFIX)) {
        // The ref is a tag, so we need to exit since the action is not compatible with a tag
        throw Error(`The specified branch ${branch} is a tag. Exiting...`)
    } else if (branch.startsWith(REF_HEADS_PREFIX)) {
        core.debug(`Stripping refs from ${branch}`)
        // This is a qualified name for a branch, so remove the qualifying stuff from it
        branch = branch.replace(REF_HEADS_PREFIX, "")
    } else {
        // The ref should be a branch, let's hope for the best
        core.debug(`The branch ${branch} is already formatted`)
    }

    return branch
}
