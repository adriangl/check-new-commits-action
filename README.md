[![check-new-commits-action status](https://github.com/adriangl/check-new-commits-action/workflows/Unit%20testing/badge.svg)](https://github.com/adriangl/check-new-commits-action/actions)

# Check new commits action

This action checks if new commits have been added to a branch in an specified time interval by checking the commits added using the GitHub REST API.

## Usage

```yaml
- name: Check for new commits today
  uses: adriangl/check-new-commits-action@v1
  with:
    token: 'your_github_token'
    seconds: 86400 # One day in seconds
    branch: 'master'
- name: Print something if new commits are found
  if: ${{ steps.check-new-commits.outputs.has-new-commits == 'true' }}
  run: echo "You have ${{ steps.check-new-commits.outputs.new-commits-number }} new commit(s) ✅!"
- name: Print another thing if new commits couldn't be found
  if: ${{ steps.check-new-commits.outputs.has-new-commits != 'true' }}
  run: echo "You don't have new commits 🛑!"
```

## Inputs
These are all the possible inputs that the action works with:

Attribute                     | Description
------------------------------|-----------------------------------------
```token```                   | Access token used to access the GitHub API. You can either use the default
```seconds```                 | (Optional) The seconds interval that the action will use to check if there have been new commits.
```branch```                  | (Optional) The branch to check for new commits. When checking out the repository that triggered a workflow, this defaults to the reference or SHA for that event. Otherwise, uses the default branch.

## Outputs
The action will dump data about the commits found in some output variables, which are:

Attribute                     | Description
------------------------------|-----------------------------------------
```has-new-commits```         | Whether or not new commits have been found for the required time interval as a boolean value (true or false).
```new-commits-number```      | The number of new commits found for the given interval. It will be 0 if no new commits could be found.

## Development
### Installing the required tools
* Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

* Set-up `nvm` with:
```shell
nvm install
```

* Install the dependencies with `npm`:
```shell
npm install
```
### Daily development workflow
* Start your terminal session with:
```shell
nvm use
```

* When you add new features, build the TypeScript code:
```bash
npm run build
```

* And then, run the unit tests:
```bash
npm test
```

### Testing the action locally
* Install [Docker Desktop](https://www.docker.com/get-started).
* Install [act](https://github.com/nektos/act).
* Create a `.secrets` file in the root of the project with the following:
```shell
GITHUB_TOKEN="a GitHub token with repo access"
```
* Create an `.env` file in the root of the project with the following content:
```shell
ACT=true # Should be set by act automatically
```
* Run the test action with:
```shell
npm run act
```

## Publishing
### Package and test all the code
* Run all checks in the project and package it:
```shell
npm run all
```
### Versioning
* Use `standard-version` to generate releases and changelogs for the new version from conventional commits syntax:
```shell
npm run release
```
* The script handles generating tags for the current release and for the current major release, as specified in the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md).

## No affiliation with GitHub Inc.
GitHub are registered trademarks of GitHub, Inc. GitHub name used in this project are for identification purposes only. The project is not associated in any way with GitHub Inc. and is not an official solution of GitHub Inc. It was made available in order to facilitate the use of the site GitHub.

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)

```
MIT License

Copyright (c) 2020 Adrián García

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
