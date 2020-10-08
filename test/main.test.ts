// The MIT License (MIT)

// Copyright (c) 2018 GitHub, Inc. and contributors

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';
import * as assert from 'assert';

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_TAG_NAME'] = 'Bla';
  const ip = path.join(__dirname, '..', 'lib', 'main.js');
  const options: cp.ExecSyncOptions = {
    env: process.env
  };
  try {
    cp.execSync(`node ${ip}`, options);
  } catch (ex) {
    return;
  }
  // an exception is expected as the GITHUB_TOKEN is not set
  assert.fail('main.js did not reject missing GITHUB_TOKEN');
});
