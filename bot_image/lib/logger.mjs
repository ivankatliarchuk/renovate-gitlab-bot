let scope = "";

export function log(msg1, ...msg) {
  console.log(`[${scope}] ${msg1}`, ...msg);
}

export function warn(msg1, ...msg) {
  console.warn(`[${scope}] ${msg1}`, ...msg);
}

export function setScope(name) {
  scope = name;
}
