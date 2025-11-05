export function escapeConfigString(str: string): string {
    return str.replace(/'/g, '\\\'')
              .replace(/"/g, '\\"')
              .replace(/\r{0,1}\n/g, '\\n')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .trim();
}
