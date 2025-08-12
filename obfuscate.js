const obfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// 针对main进行混淆. 然后在打包到asar中
const targetDir = path.join(__dirname, 'dist/main');

// 递归处理目录中的所有 .js 文件
function obfuscateDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      obfuscateDir(filePath);
    } else if (file.endsWith('.js')) {
      const code = fs.readFileSync(filePath, 'utf8');
      const obfuscated = obfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.75,
        renameGlobals: false
      });
      fs.writeFileSync(filePath, obfuscated.getObfuscatedCode(), 'utf8');
      console.log(`script encrypt success: ${filePath}`);
    }
  }
}

obfuscateDir(targetDir);
console.log('✅ all script encrypt');