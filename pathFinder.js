function findPathInState(state, targetKey, currentPath = '') {
  const isImmutable = typeof state.toJS === 'function';
  const stateObj = isImmutable ? state.toJS() : state;

  if (isImmutable) {
    if (state.has && state.has(targetKey)) {
      return `${currentPath}.get('${targetKey}')`;
    }
  } else if (Object.prototype.hasOwnProperty.call(stateObj, targetKey)) {
    return `${currentPath}['${targetKey}']`;
  }

  for (const key in stateObj) {
    if (typeof stateObj[key] === 'object' && stateObj[key] !== null) {
      const newPath = currentPath
        ? isImmutable
          ? `${currentPath}.get('${key}')`
          : `${currentPath}['${key}']`
        : key;

      const foundPath = findPathInState(
        isImmutable ? state.get(key) : stateObj[key],
        targetKey,
        newPath
      );

      if (foundPath) return foundPath;
    }
  }

  return null;
}
