export async function loadRawRenovateConfig(file) {
  const { default: config } = await import(file);

  return config instanceof Function ? config() : config;
}
