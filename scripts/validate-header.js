#!/usr/bin/env node
/**
 * validate-header.js — verify a userscript metadata block.
 *
 * Required: @name, @namespace, @version, @match (or @include), @grant
 * Also asserts the file parses as JavaScript via vm.Script.
 *
 * Exit codes: 0 = ok, 1 = missing field, 2 = parse error, 3 = bad CLI args.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REQUIRED = ["name", "namespace", "version", "grant"];
const REQUIRED_EITHER_OF = [["match", "include"]];

function fail(code, msg) {
    console.error("[validate-header] " + msg);
    process.exit(code);
}

function parseHeader(source) {
    const start = source.indexOf("// ==UserScript==");
    const end = source.indexOf("// ==/UserScript==");
    if (start === -1 || end === -1 || end <= start) {
        return null;
    }
    const block = source.slice(start, end);
    const fields = {};
    const re = /^\/\/\s+@(\S+)\s+(.*)$/gm;
    let m;
    while ((m = re.exec(block)) !== null) {
        const key = m[1];
        const val = m[2].trim();
        if (fields[key]) {
            if (!Array.isArray(fields[key])) fields[key] = [fields[key]];
            fields[key].push(val);
        } else {
            fields[key] = val;
        }
    }
    return fields;
}

function main() {
    const arg = process.argv[2];
    if (!arg) fail(3, "usage: validate-header.js <userscript.user.js>");

    const file = path.resolve(process.cwd(), arg);
    if (!fs.existsSync(file)) fail(3, "file not found: " + file);

    const source = fs.readFileSync(file, "utf8");

    // 1) header presence
    const fields = parseHeader(source);
    if (!fields) fail(1, "no // ==UserScript== ... // ==/UserScript== block found");

    const missing = REQUIRED.filter((k) => !fields[k]);
    for (const group of REQUIRED_EITHER_OF) {
        if (!group.some((k) => fields[k])) {
            missing.push(group.join("|"));
        }
    }
    if (missing.length) {
        fail(1, "missing required @ field(s): " + missing.join(", "));
    }

    // 2) parse check — userscripts use GM_* / unsafeWindow that won't resolve
    // in Node, but vm.Script's parse phase only needs syntactic validity.
    try {
        new vm.Script(source, { filename: path.basename(file) });
    } catch (e) {
        fail(2, "syntax error: " + e.message);
    }

    const summary = {
        name: fields.name,
        namespace: fields.namespace,
        version: fields.version,
        grants: Array.isArray(fields.grant) ? fields.grant.length : 1,
        matches: (Array.isArray(fields.match) ? fields.match.length : fields.match ? 1 : 0),
        includes: (Array.isArray(fields.include) ? fields.include.length : fields.include ? 1 : 0),
    };
    console.log("[validate-header] OK", JSON.stringify(summary));
    process.exit(0);
}

main();
