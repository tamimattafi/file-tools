export function formatString(string) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return string.replace(/%s/g, () => args[i++]);
}
