const fs = require('fs');
const shell = require('child_process').execSync;
const merge = require('lodash/merge')
const { moduleName } = require("./index")
const assetsFonts = "assets/fonts"

/* copy directory */
if (fs.existsSync('../esoftplay/esp.ts')) {
	if (fs.existsSync('../esoftplay/modules/' + moduleName))
		shell('rm -r ../esoftplay/modules/' + moduleName)
	shell("cp -r ./" + moduleName + " ../esoftplay/modules/")
} else {
	throw "Mohon install esoftplay package terlebih dahulu"
}

function readAsJson(path) {
	let out = ""
	try {
		out = JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }))
	} catch (e) {

	}
	return out;
}

function injectConfig(configPath) {
	if (fs.existsSync(configPath)) {
		const exsConf = readAsJson(configPath)
		const conf = readAsJson("./config.json")
		let _cf = merge({ config: conf }, exsConf)
		fs.writeFileSync(configPath, JSON.stringify({ ..._cf }, undefined, 2))
	}
}

/* injectConfig */
injectConfig("../../config.json")
injectConfig("../../config.live.json")
injectConfig("../../config.debug.json")

/* move assets */
if (fs.existsSync("./assets/")) {
	if (!fs.existsSync("../../assets/" + moduleName))
		shell("mkdir -p ../../assets/" + moduleName)
	try {
		shell("cp -r -n ./assets/* ../../assets/" + moduleName + "/")
	} catch (error) { }
}

if (fs.existsSync("./fonts/")) {
	if (!fs.existsSync("../../" + assetsFonts))
		shell("mkdir -p ../../" + assetsFonts)
	try {
		shell("cp -r -n ./fonts/* ../../" + assetsFonts + "/")
	} catch (error) { }
}

/* inject lang */
if (fs.existsSync("./id.json")) {
	let moduleLang = readAsJson("./id.json")
	if (fs.existsSync("../../assets/locale/id.json")) {
		let projectLang = readAsJson("../../assets/locale/id.json")
		let _lg = merge(moduleLang, projectLang)
		moduleLang = { ..._lg }
	}
	fs.writeFileSync("../../assets/locale/id.json", JSON.stringify(moduleLang, undefined, 2))
}

/* inject libs */
if (fs.existsSync("./libs.json")) {
	let libs = readAsJson("./libs.json")
	let libsToSkip = []
	libs.forEach((element, index) => {
		console.log(element.split("@")[0])
		if (fs.existsSync("../../node_modules/" + element.split("@")[0])) {
			libsToSkip.push(element)
		}
	})
	if (libsToSkip.length > 0) {
		libsToSkip.forEach((lib) => {
			libs = libs.filter((x) => x != lib)
			console.log(lib + " is exist, Skipped")
		})
	}
	if (libs.length > 0) {
		console.log("mohon tunggu ..")
		console.log("installing \\n" + libs.join("\\n"))
		shell("cd ../../ && expo install " + libs.join(" && expo install "))
	}
	console.log("Success..!")
}

const espPath = '../esoftplay/'
/* inject curl with logger */
if (fs.existsSync(espPath + '/modules/log')) {
	if (fs.existsSync(espPath + "modules/lib/curl.ts")) {
		let curl = fs.readFileSync(espPath + "modules/lib/curl.ts", { encoding: 'utf8' })
		curl = curl.replace(`//api_logger_import`, `import { LogStateProperty } from 'esoftplay/cache/log/state/import';`)
		curl = curl.replace(`//api_logger`, `if (LogStateProperty) {
      LogStateProperty.doLogCurl(this.uri, this.url, post, this.isSecure)
    }`)
		fs.writeFileSync(espPath + "modules/lib/curl.ts", curl)
		console.log("LibCUrl Fix !")
	}
}