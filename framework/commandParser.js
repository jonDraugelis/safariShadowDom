let command = {};

//Parse through the command line and assign inputed values to the command{} variable.
for(let commandArg of process.argv) {
    let parsed = commandArg.match(/^--([^=\s]+)=([\S]+)$/);
    if (parsed) command[parsed[1]] = parsed[2];
}

module.exports = {
    command : command,
}