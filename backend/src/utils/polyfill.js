// Polyfill for Promise.withResolvers (Node.js 18 compatibility)
// This is needed because pdfjs-dist v4.10+ uses Promise.withResolvers
// which is only available in Node.js 22+

if (typeof Promise.withResolvers === 'undefined') {
  Promise.withResolvers = function () {
    let resolve, reject
    const promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
    return { promise, resolve, reject }
  }
}

module.exports = {}

