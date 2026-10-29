/**
 * The version is decided from the commit messages on `main`. A release builds the app, deploys it to Cloudflare
 * Pages, publishes the GitHub release and commits the version bump back. Pushing to `main` deploys nothing: only
 * the create-release workflow runs this.
 *
 * Lifecycle, in plugin order:
 *   prepare  npm writes package.json -> exec tests and builds the app -> git commits the bump and pushes the tag
 *   publish  exec deploys dist/ -> github publishes the release with the notes
 */
export default {
  branches: [{ name: "main" }],

  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [{ type: "refactor", release: "patch" }],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "New" },
            { type: "fix", section: "Fixed" },
            { type: "perf", section: "Performance" },
            { type: "refactor", section: "Refactor" },
            { type: "docs", section: "Documentation" },
            { type: "build", section: "Build" },
            { type: "ci", hidden: true },
            { type: "chore", hidden: true },
            { type: "test", hidden: true },
            { type: "style", hidden: true },
          ],
        },
      },
    ],
    ["@semantic-release/npm", { npmPublish: false }],
    [
      "@semantic-release/exec",
      {
        // A release never ships a build whose tests fail: test, then build, before anything is tagged.
        // Last gate before the tag: if `main` moved while this ran, stop. Nothing is tagged or deployed, and the
        // next run starts from the new tip.
        prepareCmd:
          "npm test && npm run build && git fetch origin main && " +
          '[ "$(git rev-parse origin/main)" = "$(git rev-parse HEAD)" ] || ' +
          '{ echo "release gate failed (tests, build, or main moved); nothing tagged"; exit 1; }',
        publishCmd: "npm run deploy:pages",
      },
    ],
    [
      "@semantic-release/github",
      {
        successComment: false,
        failComment: false,
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "package-lock.json"],
        message: "chore(release): ${nextRelease.version} [skip ci]",
      },
    ],
  ],
};
