# create-nightly-release

[![Test Status](https://github.com/viperproject/create-nightly-release/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/viperproject/create-nightly-release/actions?query=workflow%3Abuild-test+branch%3Amain)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](./LICENSE)

GitHub action to create a new pre-release and delete old pre-releases created by this action.

## Usage
```
- name: Create nightly release
  id: create_release
  uses: viperproject/create-nightly-release@v1
  env:
    # This token is provided by Actions, you do not need to create your own token
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: ${{ env.TAG_NAME }}
    release_name: Nightly Release ${{ env.TAG_NAME }}
    body: Body for the release
    keep_num: 0
    keep_tags: false
```

### Inputs
- `tag_name`: The name of the tag. (required)
- `release_name`: The name of the release. For example, 'Release v1.0.1'. (required)
- `body`: Text describing the release. (optional)
- `body_path`: Path to a file whose content should be used as release body. (optional)
- `keep_num`: Number of pre-releases that should be kept in addition to the newly created one. E.g. '0' deletes all previous pre-releases created by this action except the one that was just created. (optional, default: 0)
- `keep_tags`: Specifies whether tags should be deleted if the corresponding release is deleted. (optional, default: false)

### Outputs
- `id`: The ID of the created release.
- `html_url`: The URL users can navigate to in order to view the release.
- `upload_url`: The URL for uploading assets to the release

## Create a new Release
1. Checkout this repository and pull remote changes `git pull`
2. Checkout or create a release branch (replace `v1` with the major version number): 
  - `git checkout releases/v1; git pull origin main` or 
  - `git checkout -b releases/v1`
3. Run `npm version <newversion>` to set the version number
4. Run `rm -rf dist; rm -rf node_modules; npm ci`
5. Run `npm run package`
6. Force add the dist folder: `git add -f dist`
7. Commit: `git commit -m "<commit message>`
8. Push release branch: `git push`
9. Create a GitHub release with a tag, e.g. `v1.0.0`
10. Move the major tag (e.g. `v1`) to the latest release:
```
git tag -fa v1 -m "Update v1 tag"
git push origin v1 --force
```

[More information](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
