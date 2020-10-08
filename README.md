<a href="https://github.com/viperproject/create-nightly-release/actions"><img alt="typescript-action status" src="https://github.com/viperproject/create-nightly-release/workflows/build-test/badge.svg"></a>

# create-nightly-release
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
- `keep_num`: Number of pre-releases that should be kept in addition to the newly created one. E.g. '0' deletes all previous pre-releases created by this action except the one that was just created. (optional, default: 0)
- `keep_tags`: Specifies whether tags should be deleted if the corresponding release is deleted. (optional, default: false)

### Outputs
- `id`: The ID of the created release.
- `html_url`: The URL users can navigate to in order to view the release.
- `upload_url`: The URL for uploading assets to the release

## Create a new Release
1. Checkout this repository
2. Create a new release branch (replace `v1`): `git checkout -b releases/v1`
3. Run `npm run package`
4. Force add the dist folder: `git add -f dist`
5. Commit: `git commit -m "<commit message>`
6. Push release branch: `git push`
7. Create a GitHub release with a tag, e.g. `v1.0.0`
[More information](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
