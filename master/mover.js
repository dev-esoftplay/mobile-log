const fs = require('fs');
const espPath = '../esoftplay/'

/* inject curl with logger */
if (fs.existsSync(espPath + '/modules/log')) {
	if (fs.existsSync(espPath + "modules/lib/curl.ts")) {
		let curl = fs.readFileSync(espPath + "modules/lib/curl.ts", { encoding: 'utf8' })
		curl = curl.replace(`//api_logger_import`, `import { LogStateProperty } from 'esoftplay/cache/log/state/import';`)
		curl = curl.replaceAll(`//api_logger`, `if (LogStateProperty) {
        var resJson = typeof resText == 'string' && ((resText.startsWith("{") && resText.endsWith("}")) || (resText.startsWith("[") && resText.endsWith("]"))) ? JSON.parse(resText) : resText
        LogStateProperty.doLogCurl(this.uri, this.url, post, this.isSecure, resJson)
      }`)
		fs.writeFileSync(espPath + "modules/lib/curl.ts", curl)
		console.log("LibCUrl Fix !")
	}
}