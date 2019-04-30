
function tag([string], ...values) {
  const [mainElement, ...rest] = string.split(/ /);
  return `[data-testid="${mainElement}"] ${rest.join(' ')}`;
}

export const hookInto = ([mainElement]) => rest => tag([mainElement + ' ' + rest]);