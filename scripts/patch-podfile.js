const fs = require('fs');
const path = require('path');

const podfilePath = path.join(__dirname, '..', 'ios', 'Podfile');

let podfileContent = fs.readFileSync(podfilePath, 'utf8');

if (!podfileContent.includes('use_modular_headers!')) {
  podfileContent = podfileContent.replace(
    /platform :ios,.*?\n/,
    match => `${match}use_modular_headers!\n`
  );

  fs.writeFileSync(podfilePath, podfileContent);
  console.log('✅ use_modular_headers! added to Podfile');
} else {
  console.log('⚠️ Podfile already contains use_modular_headers!');
}
