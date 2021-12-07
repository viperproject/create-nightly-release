// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
//
// Copyright (c) 2011-2020 ETH Zurich.

import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import {INVISIBLE_BODY_PREAMBLE} from './constants';

async function run(): Promise<void> {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error(`Environment variable 'GITHUB_TOKEN' is not set`);
    }

    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const octokit = github.getOctokit(token);

    // Get owner and repo from context of payload that triggered the action
    const {owner: owner, repo: repo} = github.context.repo;

    const keepNum: number =
      Number(core.getInput('keep_num', {required: false})) || 0;

    const keepTags: boolean =
      core.getInput('keep_tags', {required: false}) === 'true';

    // see https://octokit.github.io/rest.js/v18#repos-list-releases
    const {data: releases} = await octokit.rest.repos.listReleases({
      owner,
      repo
    });

    const releasesToBeDeleted = releases
      .filter(release => release.prerelease)
      // we assume that the releases are sorted by release date
      // remove the first `keep` many releases:
      .filter((_, index) => index > keepNum)
      // remove releases not created by this action:
      .filter(release => release.body != null && release.body.startsWith(INVISIBLE_BODY_PREAMBLE()))
      // reverse releases to start deleting the oldest one:
      .reverse();

    for (const release of releasesToBeDeleted) {
      await deleteRelease(octokit, owner, repo, release, keepTags);
      core.info(`Release '${release.name}' was successfully deleted`);
    }
    core.info(`${releasesToBeDeleted.length} release(s) have been deleted`);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

async function deleteRelease(
  octokit: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  release: Release,
  keepTags: boolean
): Promise<void> {
  // all assets have to be deleted first:
  for (const asset of release.assets) {
    // see https://octokit.github.io/rest.js/v18#repos-delete-release-asset
    await octokit.rest.repos.deleteReleaseAsset({
      owner,
      repo,
      asset_id: asset.id
    });
  }
  // then delete the actual release:
  // see https://octokit.github.io/rest.js/v18#repos-delete-release
  await octokit.rest.repos.deleteRelease({
    owner,
    repo,
    release_id: release.id
  });
  if (!keepTags) {
    // delete the associated tag:
    // see https://octokit.github.io/rest.js/v18#git-delete-ref
    await octokit.rest.git.deleteRef({
      owner,
      repo,
      ref: `tags/${release.tag_name}`
    });
  }
}

interface Release {
  id: number;
  name: string | null;
  body?: string | null | undefined;
  tag_name: string;
  assets: Asset[];
}

interface Asset {
  id: number;
}

run();
