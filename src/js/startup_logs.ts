import APIHelper from "./APIHelper"

const main = async () => {
  console.log("**** START LOGS ON APP LOAD ****")

  console.log("> API Server: " + APIHelper.getAPIUrl())

  const isServerOk = await APIHelper.APIServerIsOk()

  console.log("> API Server ok: " + isServerOk)

  console.log("**** END LOGS ON APP LOAD ****")

}

main()
