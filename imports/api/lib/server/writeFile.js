import fs from 'fs';

export const writeFile = (filename, path, data) => fs.writeFileSync((process.env["PWD"] + path + filename), data)

/*
export function writeFile(filename, path, contents, cb) {
  path = process.env["PWD"] + path
  fs.writeFile(filename, contents, (err) => {
    if (err) throw err
    console.log('Saved file: %s', path + filename)
    typeof cb === 'function' && cb(err, filename)
  })
}
*/

/**
  Example Usage:

writeFile('messagee.txt', '/public/', 'Hello Node!', (err, filename) => {
  if (err) throw err
  readFile(filename, (err, data) => {
    // Do something with the file's data
    const whatever = data;
  })
})
*/
