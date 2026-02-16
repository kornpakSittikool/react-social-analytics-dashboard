const { execSync } = require('node:child_process');

function parsePort(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 4301;
}

function getWindowsPids(port) {
  try {
    const output = execSync('netstat -ano -p tcp', { encoding: 'utf8' });
    const pids = new Set();
    const pattern = new RegExp(`:${port}\\s+.*LISTENING\\s+(\\d+)$`, 'i');

    for (const rawLine of output.split(/\r?\n/)) {
      const line = rawLine.trim();
      const match = line.match(pattern);
      if (match) pids.add(Number.parseInt(match[1], 10));
    }

    return [...pids].filter(Number.isFinite);
  } catch {
    return [];
  }
}

function getUnixPids(port) {
  try {
    const output = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, { encoding: 'utf8' });
    return output
      .split(/\r?\n/)
      .map((v) => Number.parseInt(v.trim(), 10))
      .filter(Number.isFinite);
  } catch {
    return [];
  }
}

function killPid(pid) {
  try {
    process.kill(pid, 'SIGKILL');
    return true;
  } catch {
    return false;
  }
}

function main() {
  const port = parsePort(process.argv[2]);
  const pids =
    process.platform === 'win32' ? getWindowsPids(port) : getUnixPids(port);

  if (pids.length === 0) {
    console.log(`[kill-port] no listener on port ${port}`);
    return;
  }

  const killed = pids.filter(killPid);
  if (killed.length > 0) {
    console.log(`[kill-port] killed pid(s) ${killed.join(', ')} on port ${port}`);
  } else {
    console.log(`[kill-port] found pid(s) ${pids.join(', ')} but could not kill`);
  }
}

main();
