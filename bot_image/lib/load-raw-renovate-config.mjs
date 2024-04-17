export async function loadRawRenovateConfig(file) {
  const { default: config } = await import(file);

  console.log(`Loaded config ${file}`);

  return config instanceof Function ? config() : config;
}
