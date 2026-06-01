import * as core from "@actions/core"
import * as github from "@actions/github"
import { CommitsInfo } from "./commits-info.js"
import {
    OUTPUT_HAS_NEW_COMMITS,
    OUTPUT_NEW_COMMITS_NUMBER,
} from "./constants.js"
import { getInputs } from "./input-helper.js"

async function run(): Promise<void> {
    try {
        const inputs = getInputs()
        const owner = github.context.repo.owner
        const repo = github.context.repo.repo

        const commitsInfo = await hasNewCommits(
            inputs.authToken,
            inputs.seconds,
            owner,
            repo,
            inputs.branch,
        )

        core.setOutput(OUTPUT_HAS_NEW_COMMITS, commitsInfo.hasNewCommits)
        core.setOutput(OUTPUT_NEW_COMMITS_NUMBER, commitsInfo.newCommitsNumber)
    } catch (error: unknown) {
        if (error instanceof Error) {
            core.setFailed(error)
        } else {
            core.setFailed("Unknown error")
        }
    }
}

async function hasNewCommits(
    authToken: string,
    seconds: number,
    owner: string,
    repo: string,
    branch: string,
): Promise<CommitsInfo> {
    core.debug("Parameters:")
    core.debug(`seconds = ${seconds}`)
    core.debug(`owner = ${owner}`)
    core.debug(`repo = ${repo}`)
    core.debug(`branch = ${branch}`)

    core.info(
        `Checking if there has been commits in the last ${seconds} seconds...`,
    )

    const currentDate = new Date()
    const commitCheckDate = new Date(currentDate.getTime() - seconds * 1000)
    const octokit = github.getOctokit(authToken)

    core.info(`Checking commits since ${commitCheckDate.toUTCString()}`)

    const { data: commitIterator } = await octokit.rest.repos.listCommits({
        owner,
        repo,
        sha: branch,
        since: commitCheckDate.toISOString(),
    })

    const commitList = Array.from(commitIterator.entries())
    const commitNumber = commitList.length
    const foundNewCommits = commitNumber > 0

    core.info(
        `There has been ${commitNumber} new commit(s) in branch "${branch}" since ${commitCheckDate.toUTCString()}`,
    )

    for (const commitData of commitList) {
        const commitInfo = commitData[1]
        core.info(
            `* ${commitInfo.commit.message.trim().split("\n", 1)[0]} by ${
                commitInfo.commit.author?.name ?? ""
            } at ${new Date(commitInfo.commit.author?.date ?? 0).toUTCString()}`,
        )
    }

    return new CommitsInfo(foundNewCommits, commitNumber)
}

void run()
