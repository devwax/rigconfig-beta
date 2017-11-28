import fs from 'fs';

export const readFile = (filename, path) => fs.readFileSync((process.env["PWD"] + path + filename), "utf8")

// See also: https://gist.github.com/awatson1978/4625493
