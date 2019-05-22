const bind = (t, func) => {
  window.addEventListener(t, func);
}
const unbind = (t, func) => {
  window.removeEventListener(t, func)
}
const mouseMoveUp = (movefunc, upfunc) => {
  bind('mousemove', movefunc)
  const up = (evt) => {
    unbind('mousemove', movefunc)
    unbind('mouseup', up)
    upfunc(evt)
  }
  bind('mouseup', up)
}

export {
  bind,
  unbind,
  mouseMoveUp
}
