import packageJson from '../../package.json' assert { type: 'json' };

export const appVersion = packageJson?.version ?? "Unknown version";
export const appDescription = packageJson?.description ?? "Unknown description";
