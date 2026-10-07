import assert from "node:assert/strict";
import { test } from "node:test";
import type { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { validatePostRules } from "../validations/validatePost.js";
import {
  validatePostStateRules,
} from "../validations/validationChanges/validatePostState.js";
import { serializeComment, serializePost } from "../lib/serializers.js";
import { validateId } from "../middleware/validateId.js";

async function runRules(
  rules: typeof validatePostRules | typeof validatePostStateRules,
  body: Record<string, unknown>
) {
  const req = {
    body,
    params: {},
    query: {},
  } as unknown as Request;

  for (const rule of rules) {
    await rule.run(req);
  }

  return { req, errors: validationResult(req) };
}

test("post validation accepts punctuation titles and both boolean body formats", async () => {
  for (const published of [true, false, "true", "false"]) {
    const { req, errors } = await runRules(validatePostRules, {
      title: "What's new: 2026!",
      content: "A useful post body.",
      published,
    });

    assert.equal(errors.isEmpty(), true);
    assert.equal(
      matchedData<{ published: boolean }>(req).published,
      published === true || published === "true"
    );
  }
});

test("post state validation rejects values that are not booleans", async () => {
  const { errors } = await runRules(validatePostStateRules, {
    published: "yes",
  });

  assert.equal(errors.isEmpty(), false);
});

test("post ID 24 passes route parameter validation", () => {
  let nextCalled = false;
  const response = {
    status: () => response,
    json: () => response,
  } as unknown as Response;

  validateId(
    {} as Request,
    response,
    () => {
      nextCalled = true;
    },
    "24",
    "id"
  );

  assert.equal(nextCalled, true);
});

test("Prisma dates serialize to stable ISO transport values", () => {
  const date = new Date("2026-01-02T03:04:05.000Z");
  const post = serializePost({
    id: 24,
    title: "A title",
    content: "Post content",
    published: true,
    createdAt: date,
    userId: 3,
    publishedAt: date,
  });
  const comment = serializeComment({
    id: 9,
    content: "Comment",
    userId: 4,
    postId: 24,
    createdAt: date,
  });

  assert.equal(post.createdAt, date.toISOString());
  assert.equal(post.publishedAt, date.toISOString());
  assert.equal(comment.createdAt, date.toISOString());
});
