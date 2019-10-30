const path = require('path');

function shortStackTrace(err, stack) {

    const isMyStack = new RegExp(
        path.join(
            __dirname,
            '../..', // go up two dirs to get to repo root -- ymmv, adust accordingly
            '[^node_modueles/]' // exclude node_modules
        )
            .replace(/\//g, '\\/')
    );

    let i;
    let frame;
    let results = [];
    for (i = 0; i < stack.length; i++) {
        frame = stack[i].toString();
        if (isMyStack.test(frame)) {
            results.push('    at ' + frame);
        }
    }
    // believe it or not you need to let webdriver throw away the first line
    // so prepend a newline if intending to return anything
    return results.length ? '\n' + results.join('\n') : '';
}

module.exports = shortStackTrace;