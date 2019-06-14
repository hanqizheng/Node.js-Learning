const a = {
  aa: ''
}

const b = {
  aa: '999',
  bb: '456',
}

const c = function A(a, b) {
  return {
    ...a,
    b,
  }
}

console.log(c(a, b))