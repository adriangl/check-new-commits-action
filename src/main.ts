// Need imports like this so ncc doesn't complain: https://github.community/t/using-es6-modules-as-github-custom-action/126949
import * as core from "@actions/core"
import * as github from "@actions/github"
import { CommitsInfo } from "./commits-info"
import { OUTPUT_HAS_NEW_COMMITS, OUTPUT_NEW_COMMITS_NUMBER } from "./constants"
import { getInputs } from "./input-helper"

// most @actions toolkit packages have async methods
async function run(): Promise<void> {
    try {
        const inputs = getInputs()
        const owner = github.context.repo.owner
        const repo = github.context.repo.repo

        const hasNewCommitsInfo = await _hasNewCommits(
            inputs.authToken,
            inputs.seconds,
            owner,
            repo,
            inputs.branch
        )

        core.setOutput(OUTPUT_HAS_NEW_COMMITS, hasNewCommitsInfo.hasNewCommits)
        core.setOutput(
            OUTPUT_NEW_COMMITS_NUMBER,
            hasNewCommitsInfo.newCommitsNumber
        )
    } catch (e: unknown) {
        // Types of stuff caught in a catch clause must be 'unknown' and then be casted to the specific type
        // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#unknown-on-catch-clause-bindings
        // https://ncjamieson.com/catching-unknowns/
        if (e instanceof Error) {
            core.setFailed(e)
        } else {
            core.setFailed("Unknown error")
        }
    }
}

async function _hasNewCommits(
    authToken: string,
    seconds: number,
    owner: string,
    repo: string,
    branch: string
): Promise<CommitsInfo> {
    core.debug("Parameters:")
    core.debug(`authToken = ${authToken}`)
    core.debug(`seconds = ${seconds}`)
    core.debug(`owner = ${owner}`)
    core.debug(`repo = ${repo}`)
    core.debug(`branch = ${branch}`)

    core.info(
        `Checking if there has been commits in the last ${seconds} seconds...`
    )

    const currentDate = new Date()
    const commitCheckDate = new Date(currentDate.getTime() - seconds * 1000)

    // Get the latest commit in the branch
    const octokit = github.getOctokit(authToken)

    core.info(`Checking commits since ${commitCheckDate.toUTCString()}`)

    const { data: commitIterator } = await octokit.rest.repos.listCommits({
        owner: owner,
        repo: repo,
        sha: branch,
        since: commitCheckDate.toISOString(),
    })

    const commitList = Array.from(commitIterator.entries())
    const commitNumber = commitList.length
    const hasNewCommits = commitNumber > 0

    core.info(
        `There has been ${commitNumber} new commit(s) in branch "${branch}" since ${commitCheckDate.toUTCString()}`
    )
    for (const commitData of commitList) {
        const commitInfo = commitData[1]
        core.info(
            `* ${commitInfo.commit.message.trim().split("\n", 1)[0]} by ${
                commitInfo.commit.author?.name ?? ""
            } at ${new Date(commitInfo.commit.author?.date ?? 0).toUTCString()}`
        )
    }

    return new CommitsInfo(hasNewCommits, commitNumber)
}

void run()
