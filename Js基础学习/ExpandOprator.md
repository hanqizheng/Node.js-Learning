# 我给你看个宝贝，它就是...

前些日子写项目遇到了一个坑，就百思不得其解，怎么都找不到那个bug是为什么，我们先来还原一下。

```js
const state = {
  List: {
    aList: {
      pagination: {},
      list: [],
    },
    bList: {
      pagination: {},
      list: [],
    }
  }
}

function AA(state, { payload }) {
  return {
    ...state,
    payload,
  }
}

function BB() {
  const payload = {
    List: {
      aList: {
        pagination: {},
        list: ['1', '2'],
      }
    }
  }

  const c = AA(state, payload)
}
```
