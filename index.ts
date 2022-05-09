#!/usr/bin/env node

/*** @experimental */
const globals = { cjs: true, await: true, mode: "all", force: true, cache: false };

require = require( "esm" )( module, globals );

module.exports = require( "./main" );
