import APIHelper from "./api/APIHelper"
import AppHelper from "./helpers/AppHelper.ts";

const main = async () => {
  console.log("**** START LOGS ON APP LOAD ****")

  console.log("> API Server URL: " + APIHelper.getAPIUrl())

  const isServerOk = await APIHelper.APIServerIsOk()

  console.log("> API Server ok: " + isServerOk)

  console.log("> Frontend URL: " + AppHelper.getFrontendUrl())

  console.log("**** END LOGS ON APP LOAD ****")

}

main()



