import test, { before } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import express from "express";
import request from "supertest";
import fs from "fs";
import path from "path";
import { serveStatic } from "../vite";
import { DIST_PUBLIC_DIR } from "../../shared/paths";

let bundleFilename: string;

before(() => {
  if (!fs.existsSync(path.join(DIST_PUBLIC_DIR, "index.html"))) {
    execSync("npm run build", {
      stdio: "ignore",
      env: {
        ...process.env,
        DATABASE_URL:
          process.env.DATABASE_URL ??
          "postgres://postgres:postgres@127.0.0.1:5432/postgres",
      },
    });
  }

  const assetsDir = path.join(DIST_PUBLIC_DIR, "assets");
  const files = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];
  bundleFilename =
    files.find((file) => file.startsWith("index-") && file.endsWith(".js")) ??
    "";

  assert.ok(
    bundleFilename,
    "expected to find a built index JavaScript bundle in dist/public/assets",
  );
});

test("serves built js bundle with javascript content type", async () => {
  const app = express();
  serveStatic(app);

  const response = await request(app).get(`/assets/${bundleFilename}`);

  assert.equal(response.status, 200);

  const contentType = response.headers["content-type"];
  assert.ok(contentType);
  assert.match(contentType, /javascript/i);
  assert.ok(
    !response.text.includes("<!DOCTYPE html"),
    "expected asset request not to return HTML document",
  );
});
