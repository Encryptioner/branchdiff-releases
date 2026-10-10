# branchdiff privacy policy

_Draft for review. Last updated: 2026-10-10._

branchdiff is a command-line tool and local web app for reviewing code. This page explains what it sends to the branchdiff account service, and what it never does.

## Your code stays with you

branchdiff never sends your code, diffs, comments, prompts, file paths, repository or branch names, git remotes or pull-request links to the branchdiff account service. Reviews run on your machine and talk to the AI tool you choose (Claude Code, Codex, Antigravity, OpenCode, Gemini, or another); that traffic is between you and that tool and is governed by its terms. branchdiff does not see or bill for it.

## What the account service receives

**Before you sign in** (the first free runs of the AI features): a one-way hash of your machine id (the raw id never leaves your machine) and a count of free runs used.

**After you sign in** (GitHub or Google):

- Your account id and the provider handle or email you sign in with.
- For each device: a label you can change, the operating system, and the branchdiff version.
- Per day and device: the number of AI runs by kind (review, resolve), how they were started, their durations, and token and cost totals as reported by your AI tool.
- If you use invite codes or coupons: the code redeemed.

You can see exactly what has been sent or is queued at any time with `branchdiff account usage --raw`.

## Free-trial relay

Before your first free-trial run, branchdiff asks a small relay service (hosted on Deno Deploy and Cloudflare) for a trial credential. The relay sees your IP address while it answers and uses it only to limit abuse. It keeps no raw IP: only salted-hash counters that expire within two days, plus a hashed blocklist entry if an address is blocked.

## How it is used

To let you sign in on several devices, show you your usage and limits, apply plans and coupons, and keep the service from being abused. We don't sell data or use it for advertising.

## Where it is stored

In Google Firebase (Authentication and Cloud Firestore). Google processes it as our provider; see Google's own policies for what it handles.

## Your choices

- `branchdiff logout` signs this device out. `branchdiff account devices --revoke <id>` signs another device out.
- To delete your account and its data, open an issue in this repository or email the address below. Include the account handle you signed in with.

## Contact

Privacy questions or deletion requests: open an issue at https://github.com/encryptioner/branchdiff-releases/issues or email **TODO: support address**.
