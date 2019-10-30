/**
 * Pause outside of the browser object. 
 * @param {int}     ms      wait in milliseconds
 */
export function hang(ms) {
    var start = new Date().getTime();
    var stop = start;
    while (stop < start + ms) {
        stop = new Date().getTime();
    }
}