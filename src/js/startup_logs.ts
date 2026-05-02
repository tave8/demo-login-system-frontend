import APIHelper from "./api/APIHelper"

const main = async () => {
  console.log("**** START LOGS ON APP LOAD ****")

  console.log("> API Server URL: " + APIHelper.getAPIUrl())

  const isServerOk = await APIHelper.APIServerIsOk()

  console.log("> API Server ok: " + isServerOk)

  console.log("**** END LOGS ON APP LOAD ****")

}

main()
