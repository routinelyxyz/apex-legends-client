const shell = require('shelljs');
const host = 'apex-legends.win';

(() => {
  const { CI_COMMIT_REF_SLUG: version, NOW_TOKEN } = process.env;
  console.log(process.env);

  if (version != null) {
    const normalizedVersion = version.substr(1, version.length).replace(/./g, '-');
    const url = `staging-${normalizedVersion}.${host}`;
    shell.echo(`Creating alias of ${url} for staging.${host}`);
    shell.exec(`npx now alias staging.apex-legends.win ${url} --token=${NOW_TOKEN}`);
  }
})();